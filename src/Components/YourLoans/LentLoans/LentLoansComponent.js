import React, { useContext } from "react";

import { useWallet } from "@solana/wallet-adapter-react";

import { Heading } from "degen";

import { DataContext } from "../../../context/DataContextProvider";
import { getLentLoans } from "../../../utils/screenUtils";

import MyLoansListComponet from "../components/MyLoansListing/MyLoansListComponent";

const LentLoansComponent = () => {
  const wallet = useWallet();

  const {
    loansData: { loans },
  } = useContext(DataContext);

  const filteredLoanOrders = getLentLoans(loans, wallet.publicKey.toString());
  return (
    <div style={{ flex: 1, marginTop: "3rem" }}>
      <div>
        <div>
          <Heading>Your lent loans</Heading>
        </div>

        {Object.keys(filteredLoanOrders).length > 0 ? (
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            <MyLoansListComponet loanOrders={filteredLoanOrders} isLentScreen />
          </div>
        ) : (
          <div style={{ marginTop: "2rem" }}>
            <h4>no loans found!</h4>
          </div>
        )}
      </div>
    </div>
  );
};

export default LentLoansComponent;
