import React from "react";
import LoanListItem from "./LoanListItemComponent";

const LoanListComponent = ({ loanOrders = [] }) => {
  return (
    Object.keys(loanOrders).length > 0 &&
    Object.keys(loanOrders).map((loanPublicKey) => {
      return (
        <LoanListItem
          loanPublicKey={loanPublicKey}
          loanObj={loanOrders[loanPublicKey]}
          key={loanPublicKey}
        />
      );
    })
  );
};

export default LoanListComponent;
