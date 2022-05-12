import React, { useState, useEffect, useContext } from "react";

import { useNavigate } from "react-router-dom";
import { PublicKey } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

import { makeStyles } from "@material-ui/styles";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { useSnackbar } from "notistack";
import { Heading } from "degen";

// import { createOrder, getOrder } from "../../utils/apiService";
import { requestLoan } from "../../utils/apiServiceNew";
import { DataContext } from "../../context/DataContextProvider";
import { getNftTokenData } from "../../utils/nftService";
import {
  LOAN_CURRENCY_TOKEN,
  ONE_DAY_IN_SECONDS,
} from "../../constants/constants";

import RequestLoanStep1 from "./steps/RequestLoanStep1";
import RequestLoanStep2 from "./steps/RequestLoanStep2";
import useForm from "../../utils/useForm";

const REQUEST_LOAN_INITIAL_STATE = {
  nftMint: "",
  amount: "",
  periodInDays: "",
  roi: "",
};

const REQUEST_LOAN_FORM_VALIDATION = {
  nftMint: { isMandatory: false },
  amount: { isMandatory: true },
  periodInDays: { isMandatory: true },
  roi: { isMandatory: true },
};

const RequestLoanScreen = ({ ...props }) => {
  const classes = useStyles();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const connection = useConnection();
  const wallet = useWallet();

  const {
    loansData: { loans, setLoans },
  } = useContext(DataContext);

  const [currentStep, setCurrentStep] = useState(0);
  const [nftData, setNftData] = useState([]);
  const [selectedNftIndex, setSelectedNftIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingRequestLoan, setLoadingRequestLoan] = useState(false);

  useEffect(async () => {
    let res = await getNftTokenData(wallet, setLoading);

    setNftData(res);
    setLoading(false);
  }, []);

  const createLoan = async () => {
    setLoadingRequestLoan(true);

    const requestedLoan = await requestLoan(
      connection.connection,
      wallet,
      setLoadingRequestLoan,
      enqueueSnackbar,
      values.amount,
      values.roi,
      values.periodInDays * ONE_DAY_IN_SECONDS,
      nftData[selectedNftIndex]
    );

    setLoans((prev) => {
      return { ...prev, ...requestedLoan };
    });

    navigate("/");
  };

  const { handleChangeWithoutEvent, values } = useForm(
    REQUEST_LOAN_INITIAL_STATE,
    REQUEST_LOAN_FORM_VALIDATION,
    createLoan,
    undefined,
    "requestLoanForm"
  );

  const renderFormStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <RequestLoanStep1
            nftData={nftData}
            loading={loading}
            setCurrentStep={setCurrentStep}
            setSelectedNftIndex={setSelectedNftIndex}
          />
        );

      case 1:
        return (
          <RequestLoanStep2
            createLoan={createLoan}
            values={values}
            handleChangeWithoutEvent={handleChangeWithoutEvent}
            selectedNftData={nftData[selectedNftIndex]}
            loading={loading}
            loadingRequestLoan={loadingRequestLoan}
          />
        );
    }
  };

  return (
    <div className={classes.root}>
      <div className={classes.headerContainer}>
        <div className={classes.header}>
          <div
            className={classes.backIcon}
            onClick={() => {
              if (currentStep === 0) navigate("/");
              else setCurrentStep(0);
            }}
          >
            <ArrowBackIcon />
          </div>
          <div className={classes.requestLoan}>
            <Heading>Request loan</Heading>
          </div>
        </div>
        <div style={{ margin: "2rem" }}>{renderFormStep()}</div>
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  root: { display: "flex", marginTop: "2.2rem", marginLeft: "14rem" },
  headerContainer: {
    display: "flex",
    flexDirection: "column",
  },
  header: { display: "flex" },
  backIcon: { display: "flex" },
  requestLoan: { marginLeft: 12, marginTop: "-0.5rem" },
  textField: {
    width: "100%",
    marginBlock: "1rem",
  },
  actionContainer: {
    marginTop: "2rem",
    marginBottom: "1.5rem",
    display: "flex",
    justifyContent: "flex-end",
  },
  action: {
    width: "20%",
    backgroundColor: "#4d7a4f",
    marginLeft: "2rem",
  },
}));

export default RequestLoanScreen;
