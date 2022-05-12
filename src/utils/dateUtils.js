export const getNumberOfMonths = (timeInSeconds) => {
  return Math.floor(getNumberOfDays(timeInSeconds) / 30);
};

export const getNumberOfDays = (timeInSeconds) => {
  let days;
  days = Math.floor(timeInSeconds / (3600 * 24));

  return days;
};
