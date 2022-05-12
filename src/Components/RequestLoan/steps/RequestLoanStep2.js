import React from "react";

import { makeStyles } from "@material-ui/styles";
import { Box } from "@material-ui/core";
import { Button, Input, Text } from "degen";

import NftInfoCard from "../../Common/NFTComponents/NftInfoCard";

const RequestLoanStep2 = ({
  createLoan,
  handleChangeWithoutEvent,
  selectedNftData,
  values,
  loading,
  loadingRequestLoan,
}) => {
  const classes = useStyles();

  return (
    <>
      <Text variant="large" weight="medium">
        Enter NFT loan details
      </Text>
      <div className={classes.root}>
        <div className={classes.form}>
          <div style={{ marginTop: "3rem", marginBottom: "1.5rem" }}>
            <Input
              label="Amount"
              placeholder="0"
              type="number"
              required
              width="screenSm"
              value={values.amount}
              onChange={(e) => {
                handleChangeWithoutEvent("amount", e.target.value);
              }}
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <Input
              label="No. of day(s)"
              placeholder="0"
              type="number"
              required
              width="screenSm"
              value={values.periodInDays}
              onChange={(e) => {
                handleChangeWithoutEvent("periodInDays", e.target.value);
              }}
            />
          </div>
          <div style={{ marginBlock: "1.5rem" }}>
            <Input
              label="Rate of interest"
              placeholder="0"
              type="number"
              required
              width="screenSm"
              value={values.roi}
              onChange={(e) => {
                handleChangeWithoutEvent("roi", e.target.value);
              }}
            />
          </div>
          <Box className={classes.actionContainer}>
            <Button
              size="small"
              variant="primary"
              loading={loadingRequestLoan}
              onClick={() => {
                createLoan();
              }}
            >
              Create loan
            </Button>
          </Box>
        </div>

        <div className={classes.nft}>
          {selectedNftData.data.data.name && (
            <NftInfoCard
              url={selectedNftData.data.data.image}
              name={selectedNftData.data.data.name}
              description={selectedNftData.data.data.description}
              loading={loading}
            />
          )}
        </div>
      </div>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  textField: {
    width: "100%",
    marginBlock: "1rem",
  },
  actionContainer: {
    marginTop: "3rem",
    marginBottom: "1.5rem",
    display: "flex",
    justifyContent: "flex-end",
  },
  form: {
    alignSelf: "center",
  },
  nft: {
    marginLeft: "10rem",
  },
}));

export default RequestLoanStep2;
