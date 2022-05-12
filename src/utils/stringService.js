import { getNumberOfMonths, getNumberOfDays } from "./dateUtils";

export const getTrimValue = (value) => {
  return typeof value === "string" ? value.trim() : value;
};

// Returns if a value is a string
export const isString = (value) => {
  return typeof value === "string" || value instanceof String;
};

// accepts period in ms and returns "n month/months" string
export const getNumberOfMonthsString = (period) => {
  const months = getNumberOfMonths(period);
  return months == 1 ? `${months} month` : `${months} months`;
};

// accepts period in ms and returns "n day/days" string
export const getNumberOfDaysString = (period) => {
  const days = getNumberOfDays(period);
  return days <= 1 ? `${days} day` : `${days} days`;
};
