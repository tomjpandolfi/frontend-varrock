import React from "react";
import { useLocation, Link } from "react-router-dom";
import { makeStyles } from "@material-ui/styles";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

const routes = ["/applied", "/lent"];

const LoanTypes = ({ ...props }) => {
  const classes = useStyles();
  let location = useLocation();

  return (
    <Tabs
      value={location.pathname !== "/loans" ? location?.pathname : routes[0]}
      orientation="horizontal"
    >
      <div className={classes.tabsBackground}>
        <Link to="/loans/applied">
          <Tab
            value={routes[0]}
            label="applied"
            className={
              location.pathname === "/loans/applied"
                ? classes.appliedSelected
                : classes.applied
            }
          />
        </Link>

        <Link to="/loans/lent">
          <Tab
            value={routes[1]}
            label="lent"
            className={
              location.pathname === "/loans/lent"
                ? classes.lentSelected
                : classes.lent
            }
          />
        </Link>
      </div>
    </Tabs>
  );
};

const useStyles = makeStyles((theme) => ({
  tabsBackground: {
    backgroundColor: "#212121",
    borderRadius: 16,
    paddingInline: "1rem",
  },
  applied: {
    color: "white",
    textDecoration: "none",
    marginBlock: "0.5rem",
    paddingInline: "2rem",
    borderRadius: 16,
    marginRight: "2rem",
    fontSize: "0.7rem",
    fontWeight: "bold",
  },
  appliedSelected: {
    color: "white",
    textDecoration: "none",
    marginBlock: "0.5rem",
    paddingInline: "2rem",
    borderRadius: 16,
    marginRight: "2rem",
    fontSize: "0.7rem",
    backgroundColor: "#101010",
    fontWeight: "bold",
  },
  lent: {
    color: "white",
    textDecoration: "none",
    marginBlock: "0.5rem",
    paddingInline: "2rem",
    borderRadius: 16,
    fontSize: "0.7rem",
    fontWeight: "bold",
  },
  lentSelected: {
    color: "white",
    textDecoration: "none",
    marginBlock: "0.5rem",
    paddingInline: "2rem",
    borderRadius: 16,
    fontSize: "0.7rem",
    backgroundColor: "#101010",
    fontWeight: "bold",
  },
}));

export default LoanTypes;
