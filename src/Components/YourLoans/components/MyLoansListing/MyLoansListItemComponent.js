import React, { useState, useEffect, useContext } from "react";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";

import { makeStyles } from "@material-ui/styles";
import { Button, Stack } from "degen";
import { useSnackbar } from "notistack";

import { DataContext } from "../../../../context/DataContextProvider";

import { ORDER_STATUS, LOAN_CURRENCY } from "../../../../constants/constants";
import { getOrderStatus } from "./../../../../utils/screenUtils";
import {
  cancelRequest,
  payback,
  liquidate,
} from "./../../../../utils/apiServiceNew";
import { extractMetaData } from "./../../../../utils/nftService";

import NftLoanCard from "../../../Common/NFTComponents/NftLoanCard";
const todaysDate = new Date();

const LoanListItemComponent = ({ isLentScreen, loanPublicKey, loanObj }) => {
  const {
    orderId,
    order,
    borrower,
    nftVault,
    stablecoinVault,
    nftMint,
    requestedAmount,
    interest,
    period,
    lender,
    loanStartTime,
    paidBackAt,
    withdrewAt,
    createdAt,
  } = loanObj;

  const classes = useStyles();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { connection } = useConnection();
  const wallet = useWallet();

  const {
    loansData: { loans, setLoans },
  } = useContext(DataContext);

  const [nftMetaData, setNftMetaData] = useState({ name: "nft name" });
  const [loadingCancel, setLoadingCancel] = useState(false);
  const [loadingPayback, setLoadingPayback] = useState(false);
  const [loadingLiquidate, setLoadingLiquidate] = useState(false);

  const isDefaulted =
    todaysDate.getTime() > period * 1000 + loanStartTime * 1000;

  const orderStatus = getOrderStatus(
    lender.toString(),
    withdrewAt.toNumber(),
    paidBackAt.toNumber(),
    isDefaulted
  );

  useEffect(async () => {
    setNftMetaData(await extractMetaData(nftMint, connection));
  }, [nftMint]);

  const cancelLoan = async () => {
    setLoadingCancel(true);

    const cancelledLoan = await cancelRequest(
      connection,
      wallet,
      setLoadingCancel,
      enqueueSnackbar,
      loanPublicKey,
      loanObj
    );

    setLoans((prev) => {
      return { ...prev, ...cancelledLoan };
    });
  };

  const paybackLoan = async () => {
    setLoadingPayback(true);

    const repaidLoan = await payback(
      connection,
      wallet,
      setLoadingPayback,
      enqueueSnackbar,
      loanPublicKey,
      loanObj
    );

    setLoans((prev) => {
      return { ...prev, ...repaidLoan };
    });
  };

  const liquidateLoan = async () => {
    setLoadingLiquidate(true);

    const liquidatedLoan = await liquidate(
      connection,
      wallet,
      setLoadingLiquidate,
      enqueueSnackbar,
      loanPublicKey,
      loanObj
    );

    setLoans((prev) => {
      return { ...prev, ...liquidatedLoan };
    });
  };

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
        <Stack direction="horizontal">
          {orderStatus === ORDER_STATUS.OPEN && !isLentScreen && (
            <Button
              size="small"
              variant="secondary"
              tone="red"
              loading={loadingCancel}
              onClick={() => {
                cancelLoan();
              }}
            >
              Cancel
            </Button>
          )}

          {orderStatus === ORDER_STATUS.PROCESSED && !isLentScreen && (
            <Button
              size="small"
              variant="secondary"
              loading={loadingPayback}
              onClick={() => {
                paybackLoan();
              }}
            >
              Repay
            </Button>
          )}

          {isDefaulted &&
            orderStatus === ORDER_STATUS.DEFAULTED &&
            isLentScreen && (
              <Button
                size="small"
                variant="secondary"
                loading={loadingLiquidate}
                onClick={() => {
                  liquidateLoan();
                }}
              >
                Liquidate
              </Button>
            )}
        </Stack>
      </div>
    </NftLoanCard>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  loanStatusOpen: {
    color: "#4d7a4f",
    border: "1px solid #4d7a4f",
    paddingInline: "1rem",
    paddingBlock: "0.2rem",
    borderRadius: 12,
  },
  loanStatusProcessed: {
    color: "#E1AD01",
    border: "1px solid #E1AD01",
    paddingInline: "1rem",
    paddingBlock: "0.2rem",
    borderRadius: 12,
  },
  actionContainer: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "1.2rem",
    marginBottom: "0.3rem",
  },
}));

export default LoanListItemComponent;
