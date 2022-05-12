import { ORDER_STATUS } from "../constants/constants";

// get loans(discoverScreen )only if lender is empty
export const getDiscoverScreenLoanOrders = (loans) => {
  let filteredOrders = {};

  Object.keys(loans).map((loanPubkey) => {
    if (
      !loans[loanPubkey].lender ||
      loans[loanPubkey].lender.toString() == "11111111111111111111111111111111"
    )
      filteredOrders[loanPubkey] = loans[loanPubkey];
  });

  return filteredOrders;
};

// get loans(applied) if current user is borrower
export const getAppliedLoanOrders = (loans, currentLoggedInUser) => {
  let filteredOrders = [];

  Object.keys(loans).map((loanPubkey) => {
    if (loans[loanPubkey].borrower.toString() === currentLoggedInUser)
      filteredOrders[loanPubkey] = loans[loanPubkey];
  });

  return filteredOrders;
};

// get loans(lent) if currentUser is lender
export const getLentLoans = (loans, currentLoggedInUser) => {
  let filteredOrders = [];
  Object.keys(loans).map((loanPubkey) => {
    if (loans[loanPubkey].lender.toString() === currentLoggedInUser)
      filteredOrders[loanPubkey] = loans[loanPubkey];
  });

  return filteredOrders;
};

export const getOrderStatus = (
  lender,
  withdrewAt,
  paidBackAt,
  isDefaulted = false
) => {
  let orderStatus = "";

  if (!lender || lender == "11111111111111111111111111111111")
    orderStatus = ORDER_STATUS.OPEN;
  else if (isDefaulted) orderStatus = ORDER_STATUS.DEFAULTED;
  else if (lender?.toString().length > 0 && !(paidBackAt || withdrewAt))
    orderStatus = ORDER_STATUS.PROCESSED;
  else if (lender?.toString().length > 0 && (paidBackAt || withdrewAt))
    orderStatus = ORDER_STATUS.CLOSED;

  return orderStatus;
};
