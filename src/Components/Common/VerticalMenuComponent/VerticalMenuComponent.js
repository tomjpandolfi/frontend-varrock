import React from "react";
import { makeStyles } from "@material-ui/styles";

import { Link } from "react-router-dom";

import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@material-ui/core";

import { Button, Heading } from "degen";

const VerticalTabMenu = ({ ...props }) => {
  const classes = useStyles();
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const handleListItemClick = (index) => {
    setSelectedIndex(index);
  };

  return (
    <>
      <div style={{ display: "flex" }}>
        <Drawer
          variant="persistent"
          anchor="left"
          open={true}
          classes={{ paper: classes.drawerPaper }}
        >
          <Typography
            variant="subtitle1"
            style={{
              position: "absolute",
              top: 16,
              fontWeight: "bold",
              color: "grey",
            }}
          >
            Honey Finance
          </Typography>

          <List>
            <Link to="/lend" className={classes.link}>
              <ListItem
                onClick={(event) => handleListItemClick(0)}
                style={{ marginBottom: 18 }}
              >
                <ListItemText
                  primary={
                    <Button
                      variant={selectedIndex === 0 ? "secondary" : "trasparent"}
                      size="medium"
                    >
                      Discover
                    </Button>
                  }
                />
              </ListItem>
            </Link>
            <Link to="/loans" className={classes.link}>
              <ListItem onClick={(event) => handleListItemClick(1)}>
                <ListItemText
                  primary={
                    <Button
                      variant={selectedIndex === 1 ? "secondary" : "trasparent"}
                      size="medium"
                    >
                      My loans
                    </Button>
                  }
                />
              </ListItem>
            </Link>
          </List>
        </Drawer>
      </div>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  drawerPaper: {
    width: "15vw",
    paddingTop: "20%",
    borderRight: 0,
    alignItems: "center",
    background:
      "linear-gradient(148.56deg, #1C1203 2.47%, rgba(45, 29, 5, 0.1) 100%)",
    backdropFilter: "blur(50px)",
    borderRadius: "8px",
  },
  link: {
    textDecoration: "none",
    color: theme.palette.text.primary,
  },
}));

export default VerticalTabMenu;
