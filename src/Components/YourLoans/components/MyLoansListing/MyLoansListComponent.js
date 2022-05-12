import React from "react";
import LoanListItem from "../MyLoansListing/MyLoansListItemComponent";

const LoanListComponent = ({ loanOrders = [], isLentScreen }) => {
  return (
    Object.keys(loanOrders).length > 0 &&
    Object.keys(loanOrders).map((loanPublicKey) => {
      return (
        <LoanListItem
          isLentScreen={isLentScreen}
          loanPublicKey={loanPublicKey}
          loanObj={loanOrders[loanPublicKey]}
          key={loanPublicKey}
        />
      );
    })
  );
};

export default LoanListComponent;
