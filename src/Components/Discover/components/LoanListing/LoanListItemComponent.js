import React, { useEffect, useState, useContext } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { makeStyles } from "@material-ui/styles";
import { useSnackbar } from "notistack";
import { Button } from "degen";

import { extractMetaData } from "./../../../../utils/nftService";
import { getOrderStatus } from "./../../../../utils/screenUtils";
// import { giveLoan } from "./../../../../utils/apiService";
import { acceptRequest } from "./../../../../utils/apiServiceNew";
import { DataContext } from "../../../../context/DataContextProvider";

import NftLoanCard from "../../../Common/NFTComponents/NftLoanCard";

const LoanListItemComponent = ({ loanPublicKey, loanObj }) => {
  const {
    nftMint,
    requestedAmount,
    interest,
    period,
    borrower,
    lender,
    paidBackAt,
    withdrewAt,
  } = loanObj;

  const classes = useStyles();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { connection } = useConnection();
  const wallet = useWallet();

  const {
    loansData: { setLoans },
  } = useContext(DataContext);

  const [nftMetaData, setNftMetaData] = useState({
    name: "nft name",
    creators: "",
  });

  const [loading, setLoading] = useState(false);

  const orderStatus = getOrderStatus(
    lender.toString(),
    withdrewAt.toNumber(),
    paidBackAt.toNumber()
  );

  const lendLoan = async () => {
    setLoading(true);
    const updatedLoan = await acceptRequest(
      connection,
      wallet,
      setLoading,
      enqueueSnackbar,
      loanPublicKey,
      loanObj
    );

    setLoans((prev) => {
      return { ...prev, ...updatedLoan };
    });
  };

  useEffect(async () => {
    setNftMetaData(await extractMetaData(nftMint, connection));
  }, [nftMint]);

  return (
    <NftLoanCard
      url={nftMetaData.image}
      name={nftMetaData.name}
      requestedAmount={requestedAmount}
      period={period}
      interest={interest}
      orderStatus={orderStatus}
    >
      <div className={classes.actionContainer}>
        <Button
          size="small"
          disabled={borrower.toString() == wallet.publicKey.toString()}
          loading={loading}
          onClick={() => {
            lendLoan();
          }}
        >
          Lend
        </Button>
      </div>
    </NftLoanCard>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    paddingInline: 12,
    paddingBlock: 12,
  },
  firstRow: {
    display: "flex",
    justifyContent: "space-between",
    fontWeight: "bold",
  },
  actionContainer: {
    marginTop: "1.2rem",
    marginBottom: "0.3rem",
    display: "flex",
    justifyContent: "flex-end",
  },
}));

export default LoanListItemComponent;
