import React, { useEffect, useMemo } from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import {
  useWallet,
  WalletProvider,
  ConnectionProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl } from "@solana/web3.js";

import { ThemeProvider } from "degen";
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from "@material-ui/core/styles";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { SnackbarProvider } from "notistack";

import DateFnsUtils from "@date-io/date-fns";

import { DataContextProvider } from "./context/DataContextProvider";

import AppBar from "./Components/Common/AppBarComponent/AppBarComponent";
import AppliedLoans from "./Components/YourLoans/AppliedLoans/AppliedLoansComponent";
import Discover from "./Components/Discover/DiscoverScreenComponent";
import HomeScreen from "./Components/Home/HomeScreenComponent";
import LentLoans from "./Components/YourLoans/LentLoans/LentLoansComponent";
import RequestLoanScreen from "./Components/RequestLoan/RequestLoanScreen";
import InitializeScreen from "./Components/InitializeScreen/InitializeScreen";
import YourLoans from "./Components/YourLoans/YourLoansScreenComponent";

import "./App.css";
import "degen/styles";

require("@solana/wallet-adapter-react-ui/styles.css");

// material ui theme
const muiTheme = createTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#ff9f0a",
    },
    secondary: {
      main: "#6c430d",
    },
    background: {
      default: "#140d01",
      paper: "#21170a",
    },
    error: {
      main: "#FF4539",
    },
    warning: {
      main: "#FFD707",
    },
    success: {
      main: "#31D158",
    },
    info: {
      main: "#0984FF",
    },
    divider: "#4f4c4c",
  },
  props: {
    MuiAppBar: {
      color: "transparent",
    },
  },
});

function App() {
  const wallet = useWallet();

  return wallet.connected ? (
    <div>
      <BrowserRouter>
        <AppBar walletConnected />
        <Routes>
          <Route path="/requestLoan" element={<RequestLoanScreen />} />
          <Route path="/initialize" element={<InitializeScreen />} />

          <Route path="/" element={<HomeScreen />}>
            <Route path="/lend" element={<Discover />} />

            <Route path="/loans" element={<YourLoans />}>
              <Route path="applied" element={<AppliedLoans />} />
              <Route path="lent" element={<LentLoans />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  ) : (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "100px",
      }}
    >
      <BrowserRouter>
        <AppBar walletConnected={false} />
      </BrowserRouter>
    </div>
  );
}

/* wallet configuration as specified here: https://github.com/solana-labs/wallet-adapter#setup */
const AppWithProvider = () => {
  const network = WalletAdapterNetwork.Devnet; //WalletAdapterNetwork.Devnet;
  let endpoint = useMemo(() => clusterApiUrl(network), [network]);
  // let endpoint = "http://127.0.0.1:8899";

  const wallets = [
    /* view list of available wallets at https://github.com/solana-labs/wallet-adapter#wallets */
    new PhantomWalletAdapter(),
  ];

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <ThemeProvider
        defaultAccent="orange"
        defaultMode="dark"
        forcedMode="dark"
      >
        <MuiThemeProvider theme={muiTheme}>
          <ConnectionProvider endpoint={endpoint}>
            <SnackbarProvider maxSnack={3} preventDuplicate>
              <DataContextProvider>
                <WalletProvider wallets={wallets} autoConnect>
                  <WalletModalProvider>
                    <App />
                  </WalletModalProvider>
                </WalletProvider>
              </DataContextProvider>
            </SnackbarProvider>
          </ConnectionProvider>
        </MuiThemeProvider>
      </ThemeProvider>
    </MuiPickersUtilsProvider>
  );
};

export default AppWithProvider;
