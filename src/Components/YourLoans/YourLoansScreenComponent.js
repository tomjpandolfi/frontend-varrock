import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import LoanTypes from "../YourLoans/LoanTypesComponent";

const YourLoansScreen = ({ ...props }) => {
  let navigate = useNavigate();

  useEffect(() => {
    navigate("/loans/applied");
  }, []);

  return (
    <>
      <div
        style={{
          marginLeft: "20vw",
          marginTop: "2.2rem",
          marginBottom: "2rem",
        }}
      >
        <LoanTypes />
        <Outlet />
      </div>
    </>
  );
};

export default YourLoansScreen;
