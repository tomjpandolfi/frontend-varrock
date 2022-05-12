import React, { createContext, useEffect, useState } from "react";
import { fetchAllLoans } from "../utils/apiServiceNew";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";

// create context
const DataContext = createContext();

const DataContextProvider = ({ children }) => {
  const [nftCollaterizedLoans, setNftCollaterizedLoans] = useState({});
  const [loans, setLoans] = useState({});

  const connection = useConnection();
  const wallet = useWallet();

  useEffect(async () => {
    const loans = await fetchAllLoans(connection.connection, wallet);
    setLoans(loans);
  }, []);

  return (
    // the Provider gives access to the context to its children
    <DataContext.Provider
      value={{
        initializeData: { nftCollaterizedLoans, setNftCollaterizedLoans },
        loansData: { loans, setLoans },
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export { DataContext, DataContextProvider };
