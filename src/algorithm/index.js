const DATA = require("./data");

const START_DATE = new Date("2017-11-17");
const END_DATE = new Date();
const TIME_PERIOD = 5;
const MAX_DAYS = 4;
// Number of milliseconds in one day.
const ONE_DAY = 86400000;

function getStartIndex(dates, startDate) {
  const startDateInMs = new Date(startDate).getTime();
  const startIndex = dates.findIndex((date, idx) => {
    const dateInMs = new Date(date).getTime();
    return dateInMs >= startDateInMs;
  });
  return startIndex;
}

function getEndIndex(dates, endDate) {
  const endDateInMs = new Date(endDate).getTime();
  let endIndex;
  for (let i = dates.length - 1; i >= 0; i--) {
    const date = dates[i];
    const dateInMs = new Date(date).getTime();
    if (dateInMs <= endDateInMs) {
      endIndex = i;
      break;
    }
  }
  return endIndex;
}

function checkDates(startDate, endDate, dates, timePeriod, maxDays) {
  const sortedDates = dates.sort();
  const startindex = getStartIndex(sortedDates, startDate);
  const endIndex = getEndIndex(sortedDates, endDate);
  const relevantDates = sortedDates.slice(startindex, endIndex + 1);
  const timePeriodInMs = ONE_DAY * timePeriod;
  for (let i = 0; i < relevantDates.length; i++) {
    const datesToCheck = relevantDates.slice(i);
    let numberOfDaysAwayInPeriod = 0;
    if (datesToCheck.length < maxDays) {
      // No point continuing if fewer values left in array than maximum allowed.
      break;
    } else {
      const firstDay = new Date(datesToCheck[0]).getTime();
      for (let j = 0; j < datesToCheck.length; j++) {
        const nextDay = new Date(datesToCheck[j]).getTime();
        const difference = nextDay - firstDay;
        if (difference <= timePeriodInMs) {
          numberOfDaysAwayInPeriod++;
        } else {
          break;
        }
      }
      if (numberOfDaysAwayInPeriod > maxDays) {
        return true;
      }
    }
  }
  return false;
}

const awayOverMax = checkDates(
  START_DATE,
  END_DATE,
  DATA,
  TIME_PERIOD,
  MAX_DAYS
);

if (awayOverMax) {
  console.log(
    `Oh dear, you were away for more than ${MAX_DAYS} days in a ${TIME_PERIOD} day period.`
  );
} else {
  console.log(
    `Well done, you weren't away for more than ${MAX_DAYS} days in a ${TIME_PERIOD} day period.`
  );
}
