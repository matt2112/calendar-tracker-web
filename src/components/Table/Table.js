// @flow

import React, { Component, Fragment } from 'react';
import { AutoSizer, Column, Table as RVTable } from 'react-virtualized';
import 'react-virtualized/styles.css';
import moment from 'moment';
import { CSVLink } from 'react-csv';

import './Table.css';
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
      <Fragment>
        {allDates.length > 0 && (
          <Fragment>
            <CSVLink
              data={allDates}
              filename="all-dates.csv"
              target="_blank"
              className="download-button"
            >
              Download Data
            </CSVLink>
            <p>(if using an AdBlocker, right click link above and choose Save Link As...)</p>
          </Fragment>
        )}
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
      </Fragment>
    );
  }
}
export default Table;
