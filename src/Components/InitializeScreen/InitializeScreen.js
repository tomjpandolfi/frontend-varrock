// import React, { useEffect, useContext } from "react";
// import { makeStyles } from "@material-ui/styles";
// import { useNavigate } from "react-router-dom";

// import { Button, Paper, Box } from "@material-ui/core";
// import ArrowBackIcon from "@material-ui/icons/ArrowBack";

// import { useConnection, useWallet } from "@solana/wallet-adapter-react";

// // import {initialize, getNftCollaterizedLoans } from "../../utils/apiService";
// import { initialize, getNftCollaterizedLoans } from "../../utils/apiServiceStub";
// import { DataContext } from "../../context/DataContextProvider";

// const InitializeScreen = ({ ...props }) => {
//   const connection = useConnection();
//   const wallet = useWallet();
//   const classes = useStyles();
//   const navigate = useNavigate();

//   const {
//     initializeData: { nftCollaterizedLoans, setNftCollaterizedLoans },
//   } = useContext(DataContext);

//   useEffect(async () => {
//     if (wallet.connected) {
//       await getNftCollaterizedLoansHandler();
//     }
//   }, [wallet]);

//   const getNftCollaterizedLoansHandler = async () => {
//     await getNftCollaterizedLoans(connection.connection, wallet);
//   };

//   const initializeRequest = async () => {
//     let stubResponse = await initialize();
//     setNftCollaterizedLoans(stubResponse);
//   };

//   return (
//     <div className={classes.root}>
//       <Paper className={classes.headerContainer}>
//         <div className={classes.header}>
//           <div
//             className={classes.backIcon}
//             onClick={() => {
//               navigate("/");
//             }}
//           >
//             <ArrowBackIcon />
//           </div>
//           <div className={classes.requestLoan}>
//             <h2>Initialize</h2>
//           </div>
//         </div>
//         <div>
//           <Box className={classes.actionContainer}>
//             <Button className={classes.action} onClick={initializeRequest}>
//               Initialize
//             </Button>
//           </Box>
//         </div>
//       </Paper>
//     </div>
//   );
// };

// const useStyles = makeStyles((theme) => ({
//   root: { display: "flex", justifyContent: "center", marginTop: "12.5%" },
//   headerContainer: {
//     display: "flex",
//     flexDirection: "column",
//     backgroundColor: "#171717",
//     borderRadius: 12,
//     marginInline: "12vw",
//   },
//   header: { display: "flex", paddingInline: "4rem", marginTop: "1rem" },
//   backIcon: { display: "flex", marginTop: "1.6rem", marginRight: 4 },
//   requestLoan: { alignSelf: "center", marginLeft: 4 },
//   textField: {
//     width: "100%",
//     marginBlock: "1.5rem",
//   },
//   actionContainer: {
//     marginTop: "2rem",
//     marginBottom: "1.5rem",
//     display: "flex",
//     justifyContent: "center",
//   },
//   action: {
//     width: 100,
//     backgroundColor: "#4d7a4f",
//   },
// }));

// export default InitializeScreen;
