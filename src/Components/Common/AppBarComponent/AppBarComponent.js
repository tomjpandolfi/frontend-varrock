import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  WalletMultiButton,
  WalletDisconnectButton,
} from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Popover from "@mui/material/Popover";
import { Typography } from "@mui/material";

import { Button, IconChevronDown, Text } from "degen";

const AppBarComponent = ({ walletConnected }) => {
  const location = useLocation();
  let navigate = useNavigate();
  const wallet = useWallet();

  const [anchorEl, setAnchorEl] = useState(null);
  const [togglePopover, setTogglePopover] = useState(false);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        style={{
          backgroundColor: "transparent",
          backdropFilter: "blur(5px)",
          marginBottom: "12rem",
          // paddingBlock: 8,
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <div>
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
          </div>
          {walletConnected ? (
            <div style={{ display: "flex" }}>
              <div>
                {location.pathname !== "/requestLoan" && (
                  <Button
                    size="small"
                    style={{
                      marginRight: 30,
                    }}
                    onClick={() => navigate("/requestLoan")}
                  >
                    Request Loan
                  </Button>
                )}
              </div>
              <div>
                <Button
                  size="small"
                  variant="transparent"
                  suffix={<IconChevronDown />}
                  style={{
                    paddingInline: "1rem",
                    color: "#ff9f0a",
                    border: 1,
                  }}
                  onClick={(event) => {
                    setAnchorEl(event.currentTarget);
                    setTogglePopover(true);
                  }}
                >
                  {wallet.publicKey.toString().slice(0, 5)}
                  {"......"}
                  {wallet.publicKey
                    .toString()
                    .substr(wallet.publicKey.toString().length - 5)}
                </Button>
              </div>
              <Popover
                id={togglePopover ? "simple-popover" : undefined}
                open={togglePopover}
                anchorEl={anchorEl}
                onClose={() => {
                  setTogglePopover(false);
                  setAnchorEl(null);
                }}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
              >
                <Box sx={{ p: 2 }}>
                  <WalletDisconnectButton
                    onClick={() => setTogglePopover(false)}
                  />
                </Box>
              </Popover>
            </div>
          ) : (
            <WalletMultiButton />
          )}
        </Toolbar>
      </AppBar>
      <Toolbar />
    </Box>
  );
};

export default AppBarComponent;
