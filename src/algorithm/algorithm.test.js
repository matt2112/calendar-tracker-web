import moment from 'moment';

import algorithm, { getStartIndex, getEndIndex } from './index';

describe('algorithm', () => {
  test('should give a negative result if meets requirements', () => {
    const startDate = moment('2018-04-10');
    const endDate = moment('2018-04-25');
    const dates = [
      new Date('2018-04-12'),
      new Date('2018-04-14'),
      new Date('2018-04-22'),
      new Date('2018-04-23')
    ];
    const timePeriod = 4;
    const maxDays = 2;
    const result = algorithm(startDate, endDate, dates, timePeriod, maxDays);
    expect(result).toEqual([false, 0]);
  });

  test('should give negative result if fails requirements', () => {
    const startDate = moment('2018-04-10');
    const endDate = moment('2018-04-25');
    const dates = [
      new Date('2018-04-12'),
      new Date('2018-04-14'),
      new Date('2018-04-15'),
      new Date('2018-04-22'),
      new Date('2018-04-23')
    ];
    const timePeriod = 4;
    const maxDays = 2;
    const result = algorithm(startDate, endDate, dates, timePeriod, maxDays);
    expect(result).toEqual([true, 3]);
  });

  test('getStartIndex should return correct index', () => {
    const sortedDates = [
      new Date('2016-03-12'),
      new Date('2017-05-01'),
      new Date('2017-11-23'),
      new Date('2018-11-19'),
      new Date('2018-04-17')
    ];

    const startDateOne = moment('2017-11-22');
    const resultOne = getStartIndex(sortedDates, startDateOne);
    expect(resultOne).toEqual(2);

    const startDateTwo = moment('2017-11-23');
    const resultTwo = getStartIndex(sortedDates, startDateTwo);
    expect(resultTwo).toEqual(2);

    const startDateThree = moment('2017-11-24');
    const resultThree = getStartIndex(sortedDates, startDateThree);
    expect(resultThree).toEqual(3);
  });

  test('getEndIndex should return correct index', () => {
    const sortedDates = [
      new Date('2017-03-12'),
      new Date('2018-05-01'),
      new Date('2019-11-23'),
      new Date('2020-11-30'),
      new Date('2020-12-01')
    ];

    const startDateOne = moment('2020-11-29');
    const resultOne = getEndIndex(sortedDates, startDateOne);
    expect(resultOne).toEqual(2);

    const startDateTwo = moment('2020-11-30');
    const resultTwo = getEndIndex(sortedDates, startDateTwo);
    expect(resultTwo).toEqual(3);

    const startDateThree = moment('2020-12-01');
    const resultThree = getEndIndex(sortedDates, startDateThree);
    expect(resultThree).toEqual(4);
  });
});
