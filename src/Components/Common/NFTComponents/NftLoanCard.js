import React from "react";

import { makeStyles } from "@material-ui/styles";
import { Text, Button } from "degen";

import { getNumberOfDaysString } from "./../../../utils/stringService";

import NftInfoCard from "./NftInfoCard";

const NftLoanCard = ({
  url,
  name = "",
  description = "",
  requestedAmount,
  period,
  interest,
  children,
  loading,
  index,
  orderStatus,
}) => {
  const classes = useStyles();
  return (
    <div key={index}>
      <NftInfoCard
        url={url}
        name={name}
        description={description}
        orderStatus={orderStatus}
      >
        <span className={classes.amtAndPeriod}>
          {requestedAmount && (
            <div style={{ textAlign: "center" }}>
              <Text variant="small" color="textSecondary">
                amount
              </Text>

              <Text
                variant="base"
                weight="semiBold"
                color="foreground"
                ellipsis
              >
                {requestedAmount.toNumber()}
              </Text>
            </div>
          )}
          {period && (
            <div style={{ textAlign: "center" }}>
              <Text variant="small" color="textSecondary">
                period
              </Text>

              <Text
                variant="small"
                weight="semiBold"
                color="foreground"
                ellipsis
              >
                {getNumberOfDaysString(period.toNumber())}
              </Text>
            </div>
          )}
          {interest && (
            <div style={{ textAlign: "center" }}>
              <Text variant="small" color="textSecondary">
                interest
              </Text>
              <Text
                variant="base"
                weight="semiBold"
                color="foreground"
                ellipsis
              >
                {interest.toNumber()}
              </Text>
            </div>
          )}
        </span>
        <div>{children}</div>
      </NftInfoCard>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    paddingInline: "0.5rem",
  },
  amtAndPeriod: {
    display: "flex",
    justifyContent: "space-between",
  },
}));

export default NftLoanCard;
