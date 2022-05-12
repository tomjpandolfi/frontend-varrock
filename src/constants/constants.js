import { PublicKey } from "@solana/web3.js";

export const ORDER_STATUS = {
  OPEN: "open",
  CLOSED: "closed",
  PROCESSED: "processed",
  DEFAULTED: "defaulted",
};

export const ONE_DAY_MS = 86400000;
export const ONE_DAY_IN_SECONDS = 86400;

export const METADATA_PROGRAM_ID = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

export const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new PublicKey(
  'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
);

export const LOAN_CURRENCY_TOKEN = new PublicKey(
  'So11111111111111111111111111111111111111112'
);

