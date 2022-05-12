import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import VerticalMenu from "../Common/VerticalMenuComponent/VerticalMenuComponent";

const HomeScreen = ({ ...props }) => {
  let navigate = useNavigate();

  useEffect(() => {
    navigate("/lend");
  }, []);

  return (
    <div>
      <VerticalMenu />
      <Outlet />
    </div>
  );
};

export default HomeScreen;
