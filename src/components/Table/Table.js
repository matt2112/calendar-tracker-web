// @flow

import React, { Component } from 'react';
import { AutoSizer, Column, Table as RVTable } from 'react-virtualized';
import 'react-virtualized/styles.css';
import moment from 'moment';

import { ABROAD, TRAVELLING } from '../../constants';

type Props = {
  datesAway: Array<{
    allDay: boolean,
    end: Date,
    id: number,
    start: Date,
    title: string
  }>,
  options: {
    maxDays: number,
    timePeriod: number,
    startDate: moment,
    endDate: moment
  }
};

type State = {
  allDates: Array<{
    departure: string,
    return: string,
    away: number
  }>
};

class Table extends Component<Props, State> {
  state = {
    allDates: [
      {
        departure: 'depart one',
        return: 'arrive one',
        away: 3
      },
      {
        departure: 'depart two',
        return: 'arrive two',
        away: 5
      }
    ]
  };

  componentDidMount = () => {
    this.generateAllDates();
  };

  generateAllDates = () => {
    const sortedDates = this.props.datesAway
      .concat()
      .sort((a, b) => a.start.getTime() - b.start.getTime());
    let searchingForStart = true;
    const allDates = [];
    let nextDate;
    sortedDates.forEach((date) => {
      if (searchingForStart && date.title === TRAVELLING) {
        nextDate = {
          departure: moment(date.start).format('DD/MM/YYYY'),
          return: '',
          away: 0
        };
        searchingForStart = false;
      } else if (!searchingForStart && date.title === TRAVELLING) {
        nextDate.return = moment(date.start).format('DD/MM/YYYY');
        allDates.push(nextDate);
        searchingForStart = true;
      } else if (!searchingForStart && date.title === ABROAD) {
        nextDate.away += 1;
      }
    });
    this.setState({
      allDates
    });
  };

  render() {
    const { allDates } = this.state;
    return (
      <AutoSizer>
        {({ height, width }) => (
          <RVTable
            width={width}
            height={height}
            headerHeight={20}
            rowHeight={30}
            rowCount={allDates.length}
            rowGetter={({ index }) => allDates[index]}
          >
            <Column label="Departure" dataKey="departure" width={0} flexGrow={1} />
            <Column label="Return" dataKey="return" width={0} flexGrow={1} />
            <Column label="Number of Days Away" dataKey="away" width={0} flexGrow={1} />
          </RVTable>
        )}
      </AutoSizer>
    );
  }
}
export default Table;
