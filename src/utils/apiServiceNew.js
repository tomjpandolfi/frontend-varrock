import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import { web3, Program } from "@project-serum/anchor";
import {
  TOKEN_PROGRAM_ID,
  Token,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

import idl from "./../idl.json";
import {
  LOAN_CURRENCY_TOKEN,
  SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
  METADATA_PROGRAM_ID,
} from "../constants/constants";

const programID = new PublicKey(idl.metadata.address);

async function getProvider(connection, wallet) {
  const provider = new anchor.Provider(
    connection,
    wallet,
    anchor.Provider.defaultOptions()
  );
  return provider;
}

async function getOrCreateAssociatedTokenAddress(
  connection,
  userWallet,
  associatedToken
) {
  // Get the derived address of the destination wallet which will hold the custom token
  const associatedTokenAddress = await Token.getAssociatedTokenAddress(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    associatedToken,
    userWallet.publicKey
  );

  let associatedTokenAccountInfo;

  try {
    associatedTokenAccountInfo = await connection.getAccountInfo(
      associatedTokenAddress
    );
  } catch {
    console.log("associatedTokenAccountInfo not present");
  }

  if (!associatedTokenAccountInfo) {
    const instructions = [];
    instructions.push(
      Token.createAssociatedTokenAccountInstruction(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        associatedToken,
        associatedTokenAddress,
        userWallet.publicKey,
        userWallet.publicKey
      )
    );

    const transaction = new web3.Transaction().add(...instructions);
    transaction.feePayer = userWallet.publicKey;
    transaction.recentBlockhash = (
      await connection.getRecentBlockhash()
    ).blockhash;

    const signed = await userWallet.signTransaction(transaction);

    const transactionSignature = await connection.sendRawTransaction(
      signed.serialize(),
      connection
    );

    await connection.confirmTransaction(transactionSignature);

    console.log(transactionSignature);
  }

  return associatedTokenAddress;
}

export const fetchLoan = async (connection, userWallet, loanPubKey) => {
  const provider = await getProvider(connection, userWallet);
  anchor.setProvider(provider);
  const program = new anchor.Program(idl, idl.metadata.address);

  let loanData = await program.account.loanMetadata.fetch(loanPubKey);

  const loan = {};
  loan[loanPubKey] = loanData;

  return loan;
};

export const fetchAllLoans = async (connection, userWallet) => {
  const provider = await getProvider(connection, userWallet);
  anchor.setProvider(provider);
  const program = new anchor.Program(idl, idl.metadata.address);

  let loansData = await program.account.loanMetadata.all();

  const loans = {};
  loansData.map((loan) => {
    loans[loan.publicKey.toString()] = loan.account;
  });

  return loans;
};

export const requestLoan = async (
  connection,
  userWallet,
  setLoadingRequestLoan,
  notification,
  requestAmount,
  interest,
  period,
  nftData
) => {
  const provider = await getProvider(connection, userWallet);
  anchor.setProvider(provider);

  const program = new Program(idl, idl.metadata.address);

  console.log("requesting loan...");

  const nftMint = new PublicKey(nftData.nft.mint);

  const nftVerifiedCreatorAddress = nftData.nft.data.creators.filter(
    (creator) => creator.verified == 1
  )[0].address;
  if (!nftVerifiedCreatorAddress) {
    console.log("no verified creator found");
    return;
  }
  const nftVerifiedCreator = new PublicKey(nftVerifiedCreatorAddress);

  //@ts-ignore
  const [
    vaultAuthority,
    vaultAuthorityBump,
  ] = await web3.PublicKey.findProgramAddress(
    [Buffer.from("nft"), nftVerifiedCreator.toBuffer()],
    programID
  );

  //@ts-ignore
  const [
    loanMetadata,
    loanMetadataBump,
  ] = await web3.PublicKey.findProgramAddress(
    [vaultAuthority.toBuffer(), nftMint.toBuffer()],
    programID
  );

  const [nft_metadata, metadataBump] = await web3.PublicKey.findProgramAddress(
    [
      Buffer.from("metadata"),
      METADATA_PROGRAM_ID.toBuffer(),
      nftMint.toBuffer(),
    ],
    METADATA_PROGRAM_ID
  );

  const [nftVault] = await PublicKey.findProgramAddress(
    [
      vaultAuthority.toBuffer(),
      TOKEN_PROGRAM_ID.toBuffer(),
      nftMint.toBuffer(),
    ],
    SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
  );

  //@ts-ignore
  let bumps = {
    vaultAuthority: new anchor.BN(vaultAuthorityBump),
    loanMetadata: new anchor.BN(loanMetadataBump),
  };

  const borrowerTokenAccount = await getOrCreateAssociatedTokenAddress(
    connection,
    userWallet,
    LOAN_CURRENCY_TOKEN
  );

  const borrowerNftAccount = await getOrCreateAssociatedTokenAddress(
    connection,
    userWallet,
    nftMint
  );

  console.log("loanMetadata", loanMetadata.toString());
  console.log("vaultAuthority", vaultAuthority.toString());
  console.log("nftMint", nftMint.toString());
  console.log("nft_metadata", nft_metadata.toString());
  console.log("nftVerifiedCreator", nftVerifiedCreator.toString());
  console.log("nftVault", nftVault.toString());
  console.log("tokenMint", LOAN_CURRENCY_TOKEN);
  console.log("borrowerNftAccount", borrowerNftAccount.toString());
  console.log("borrowerTokenAccount", borrowerTokenAccount.toString());
  console.log("borrower", userWallet.publicKey.toString());

  try {
    await program.rpc.borrowRequest(
      bumps,
      new anchor.BN(requestAmount),
      new anchor.BN(interest),
      new anchor.BN(period),
      {
        accounts: {
          loanMetadata: loanMetadata,
          vaultAuthority: vaultAuthority,
          nftMint: new PublicKey(nftMint),
          nftMetadata: nft_metadata,
          nftVerifiedCreator: nftVerifiedCreator,
          nftVault: nftVault,
          borrower: userWallet.publicKey,
          tokenMint: new PublicKey(LOAN_CURRENCY_TOKEN),
          borrowerNftAccount: borrowerNftAccount,
          borrowerTokenAccount: borrowerTokenAccount,
          associatedTokenProgram: SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: web3.SystemProgram.programId,
          rent: web3.SYSVAR_RENT_PUBKEY,
        },
      }
    );
    setLoadingRequestLoan(false);
    notification("Loan order created successfully ", {
      variant: "success",
      anchorOrigin: {
        vertical: "bottom",
        horizontal: "right",
      },
    });
  } catch (e) {
    console.log("Promise rejected!", e.msg, e.code);
    setLoadingRequestLoan(false);
    notification(e.msg || "Error", {
      variant: "error",
      anchorOrigin: {
        vertical: "bottom",
        horizontal: "right",
      },
    });
  } finally {
    setLoadingRequestLoan(false);
  }

  const requestedLoan = fetchLoan(connection, userWallet, loanMetadata);

  return requestedLoan;
};

export const acceptRequest = async (
  connection,
  userWallet,
  setLoading,
  notification,
  loanPublicKey,
  loanObj
) => {
  const provider = await getProvider(connection, userWallet);
  anchor.setProvider(provider);

  const program = new Program(idl, idl.metadata.address);

  console.log("accepting loan request...");

  const {
    vaultAuthority,
    nftMint,
    nftVerifiedCreator,
    borrower,
    borrowerTokenAccount,
    tokenMint,
  } = loanObj;

  const lenderTokenAccount = await getOrCreateAssociatedTokenAddress(
    connection,
    userWallet,
    LOAN_CURRENCY_TOKEN
  );

  const lenderNftAccount = await getOrCreateAssociatedTokenAddress(
    connection,
    userWallet,
    nftMint
  );

  // console.log("loanMetadata", loanPublicKey);
  // console.log("vaultAuthority", vaultAuthority.toString());
  // console.log("nftMint", nftMint.toString());
  // console.log("nftVerifiedCreator", nftVerifiedCreator.toString());
  // console.log("borrower", borrower.toString());
  // console.log("borrowerTokenAccount", borrowerTokenAccount.toString());
  // console.log("tokenMint", tokenMint.toString());
  // console.log("lender", userWallet.publicKey.toString());
  // console.log("lenderTokenAccount", lenderTokenAccount.toString());
  // console.log("lenderNftAccount", associatedLenderNftTokenAddr.toString());
  // console.log("tokenProgram", TOKEN_PROGRAM_ID);

  try {
    const res = await program.rpc.acceptRequest({
      accounts: {
        loanMetadata: new PublicKey(loanPublicKey),
        vaultAuthority: vaultAuthority,
        nftMint: nftMint,
        nftVerifiedCreator: nftVerifiedCreator,
        borrower: borrower,
        borrowerTokenAccount: borrowerTokenAccount,
        tokenMint: tokenMint,
        lender: userWallet.publicKey,
        lenderTokenAccount: lenderTokenAccount,
        lenderNftAccount: lenderNftAccount,
        associatedTokenProgram: SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: web3.SystemProgram.programId,
        rent: web3.SYSVAR_RENT_PUBKEY,
      },
    });
    setLoading(false);

    console.log("Promise resolved", res);

    notification("Lend successful ", {
      variant: "success",
      anchorOrigin: {
        vertical: "bottom",
        horizontal: "right",
      },
    });
  } catch (e) {
    console.log("Promise rejected!", e.msg, e.code);
    notification(e.msg || "Error", {
      variant: "error",
      anchorOrigin: {
        vertical: "bottom",
        horizontal: "right",
      },
    });
    setLoading(false);
  } finally {
    setLoading(false);
  }
  // console.log("res", res);

  const updatedLoan = await fetchLoan(connection, userWallet, loanPublicKey);
  return updatedLoan;
};

export const liquidate = async (
  connection,
  userWallet,
  setLoadingLiquidate,
  notification,
  loanPubKey,
  loanObj
) => {
  const provider = await getProvider(connection, userWallet);
  anchor.setProvider(provider);

  const program = new Program(idl, idl.metadata.address);

  console.log("liquidating loan...");

  const { vaultAuthority, nftVault, lenderNftAccount, nftMint } = loanObj;

  // console.log("loanPubKey", loanPubKey.toString());
  // console.log("vaultvaultAuthority", vaultAuthority.toString());
  // console.log("userWallet", userWallet.publicKey.toString());
  // console.log("nftVault", nftVault.toString());
  // console.log("lenderNftAccount", lenderNftAccount.toString());
  // console.log("TOKEN_PROGRAM_IDT", TOKEN_PROGRAM_ID.toString());

  try {
    await program.rpc.liquidateLoan({
      accounts: {
        loanMetadata: loanPubKey,
        vaultAuthority: vaultAuthority,
        lender: userWallet.publicKey,
        nftVault: nftVault,
        lenderNftAccount: lenderNftAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
        nftMint: nftMint,
      },
    });
    setLoadingLiquidate(false);
    notification("Liquidate successful ", {
      variant: "sucess",
      anchorOrigin: {
        vertical: "bottom",
        horizontal: "right",
      },
    });
  } catch (e) {
    console.log("Promise rejected!", e.msg, e.code);
    setLoadingLiquidate(false);
    notification(e.msg || "Error", {
      variant: "error",
      anchorOrigin: {
        vertical: "bottom",
        horizontal: "right",
      },
    });
  } finally {
    setLoadingLiquidate(false);
  }

  const updatedLoan = fetchLoan(connection, userWallet, loanPubKey);

  return updatedLoan;
};

export const payback = async (
  connection,
  userWallet,
  setLoadingPayback,
  notification,
  loanPublicKey,
  loanObj
) => {
  const {
    vaultAuthority,
    nftMint,
    nftVault,
    borrowerTokenAccount,
    borrowerNftAccount,
    lenderTokenAccount,
  } = loanObj;

  const provider = await getProvider(connection, userWallet);
  anchor.setProvider(provider);

  const program = new Program(idl, idl.metadata.address);

  console.log("payback loan...");
  // console.log(TOKEN_PROGRAM_ID);

  try {
    const res = await program.rpc.paybackLoan({
      accounts: {
        loanMetadata: new PublicKey(loanPublicKey),
        vaultAuthority: vaultAuthority,
        borrower: userWallet.publicKey,
        borrowerNftAccount: new PublicKey(borrowerNftAccount),
        nftVault: nftVault,
        borrowerTokenAccount: new PublicKey(borrowerTokenAccount),
        lenderTokenAccount: lenderTokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
        nftMint: nftMint,
      },
    });

    setLoadingPayback(false);
    notification("payback successful ", {
      variant: "sucess",
      anchorOrigin: {
        vertical: "bottom",
        horizontal: "right",
      },
    });
  } catch (e) {
    console.log("Promise rejected!", e.msg, e.code);
    setLoadingPayback(false);
    notification(e.msg || "Error", {
      variant: "error",
      anchorOrigin: {
        vertical: "bottom",
        horizontal: "right",
      },
    });
  } finally {
    setLoadingPayback(false);
  }

  // console.log("res", res);

  const updatedLoan = fetchLoan(connection, userWallet, loanPublicKey);

  return updatedLoan;
};

export const cancelRequest = async (
  connection,
  userWallet,
  setLoadingCancel,
  notification,
  loanPublicKey,
  loanObj
) => {
  const { vaultAuthority, nftVault, borrowerNftAccount } = loanObj;

  const provider = await getProvider(connection, userWallet);
  anchor.setProvider(provider);

  const program = new Program(idl, idl.metadata.address);

  console.log("cancel request...");
  try {
    const res = await program.rpc.cancelRequest({
      accounts: {
        loanMetadata: new PublicKey(loanPublicKey),
        vaultAuthority: vaultAuthority,
        borrower: userWallet.publicKey,
        borrowerNftAccount: new PublicKey(borrowerNftAccount),
        nftVault: nftVault,
        tokenProgram: TOKEN_PROGRAM_ID,
      },
    });
    setLoadingCancel(false);
    notification("Loan request successfully deleted ", {
      variant: "sucess",
      anchorOrigin: {
        vertical: "bottom",
        horizontal: "right",
      },
    });
  } catch (e) {
    console.log("Promise rejected!", e.msg, e.code);
    setLoadingCancel(false);
    notification(e.msg || "Error", {
      variant: "error",
      anchorOrigin: {
        vertical: "bottom",
        horizontal: "right",
      },
    });
  } finally {
    setLoadingCancel(false);
  }

  const updatedLoan = fetchLoan(connection, userWallet, loanPublicKey);

  return updatedLoan;
};
