import { programs } from "@metaplex/js";
import { clusterApiUrl, PublicKey } from "@solana/web3.js";

import {
  getParsedNftAccountsByOwner,
  isValidSolanaAddress,
  createConnectionConfig,
} from "@nfteyez/sol-rayz";

import axios from "axios";

export const extractMetaData = async (mint, connection) => {
  const tokenmetaPubkey = await programs.metadata.Metadata.getPDA(
    new PublicKey(mint.toString())
  );

  const tokenmeta = await programs.metadata.Metadata.load(
    connection,
    tokenmetaPubkey
  );

  let nftMetaData = await (await fetch(tokenmeta.data.data.uri)).json();

  return {
    name: nftMetaData.name,
    symbol: nftMetaData.symbol,
    updateAuthority: tokenmeta.data.updateAuthority,
    image: nftMetaData.image,
    creators: nftMetaData.properties.creators,
    tokenId: tokenmetaPubkey.toString(),
    mint: mint.toString(),
  };
};

const getAllNftData = async (wallet) => {
  try {
    const connect = createConnectionConfig(clusterApiUrl("devnet"));
    let ownerToken = wallet.publicKey.toString();
    const result = isValidSolanaAddress(ownerToken);
    console.log("isValidSolanaAddress - ", result);
    const nfts = await getParsedNftAccountsByOwner({
      publicAddress: ownerToken,
      connection: connect,
      serialization: true,
    });

    return nfts;
  } catch (error) {
    console.log(error);
  }
};

//Function to get all nft data
export const getNftTokenData = async (wallet) => {
  try {
    let nftData = await getAllNftData(wallet);
    var data = Object.keys(nftData).map((key) => nftData[key]);
    let arr = [];
    let n = data.length;
    for (let i = 0; i < n; i++) {
      let val = await axios.get(data[i].data.uri);
      arr.push({ nft: data[i], data: val });
    }
    return arr;
  } catch (error) {
    console.log(error);
  }
};
