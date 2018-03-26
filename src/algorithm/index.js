// @flow

import { type Moment } from 'moment';

// Number of milliseconds in one day.
const ONE_DAY = 86400000;

const getStartIndex = (dates: Array<Date>, startDate: Moment): number => {
  const startDateInMs = startDate.valueOf();
  const startIndex = dates.findIndex((date) => {
    const dateInMs = date.getTime();
    return dateInMs >= startDateInMs;
  });
  return startIndex;
};

const getEndIndex = (dates: Array<Date>, endDate: Moment): number => {
  const endDateInMs = endDate.valueOf();
  dates.reverse();
  return dates.findIndex(date => date.getTime() <= endDateInMs);
};

// Returns true if away over maximum time period.
export default (
  startDate: Moment,
  endDate: Moment,
  dates: Array<Date>,
  timePeriod: number,
  maxDays: number
): [boolean, number] => {
  const sortedDates = dates.concat().sort((a, b) => a.getTime() - b.getTime());
  const startIndex = getStartIndex(sortedDates, startDate);
  const endIndex = getEndIndex(sortedDates, endDate);
  if (endIndex === -1) {
    return [false, 0];
  }
  const relevantDates = sortedDates.slice(startIndex, endIndex + 1);
  const timePeriodInMs = ONE_DAY * timePeriod;
  for (let i = 0; i < relevantDates.length; i += 1) {
    const datesToCheck = relevantDates.slice(i);
    let numberOfDaysAwayInPeriod = 0;
    if (datesToCheck.length < maxDays) {
      // No point continuing if fewer values left in array than maximum allowed.
      break;
    } else {
      const firstDay = new Date(datesToCheck[0]).getTime();
      for (let j = 0; j < datesToCheck.length; j += 1) {
        const nextDay = new Date(datesToCheck[j]).getTime();
        const difference = nextDay - firstDay;
        if (difference + ONE_DAY <= timePeriodInMs) {
          numberOfDaysAwayInPeriod += 1;
        } else {
          break;
        }
      }
      if (numberOfDaysAwayInPeriod > maxDays) {
        return [true, numberOfDaysAwayInPeriod];
      }
    }
  }
  return [false, 0];
};
