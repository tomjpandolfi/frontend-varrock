import React, { useContext } from "react";
import { Outlet } from "react-router-dom";

import { Stack, Heading } from "degen";

import { DataContext } from "../../context/DataContextProvider";
import { getDiscoverScreenLoanOrders } from "../../utils/screenUtils";

import LoanList from "./components/LoanListing/LoanListComponent";
import NftInfoCard from "../Common/NFTComponents/NftInfoCard";
const DiscoverScreen = ({ ...props }) => {
  const {
    loansData: { loans },
  } = useContext(DataContext);

  const sortedLoanOrders = getDiscoverScreenLoanOrders(loans);

  return (
    <div
      style={{ marginLeft: "20vw", marginTop: "2.2rem", marginBottom: "2rem" }}
    >
      <div>
        <Heading>Discover loans</Heading>
      </div>
      {Object.keys(sortedLoanOrders).length > 0 ? (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          <LoanList loanOrders={sortedLoanOrders} />
          <Outlet />
        </div>
      ) : (
        <div>
          <Stack direction="horizontal">
            <NftInfoCard onCardClick={() => {}} loading />
            <NftInfoCard onCardClick={() => {}} loading />
            <NftInfoCard onCardClick={() => {}} loading />
          </Stack>
        </div>
      )}
    </div>
  );
};

export default DiscoverScreen;
