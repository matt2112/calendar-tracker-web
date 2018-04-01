import React, { Component } from 'react';
import { Table as RVTable, Column } from 'react-virtualized';
import 'react-virtualized/styles.css';

class Table extends Component {
  state = {
    dates: [
      {
        departure: 'depart one',
        arrival: 'arrive one',
        away: 3
      },
      {
        departure: 'depart two',
        arrival: 'arrive two',
        away: 5
      }
    ]
  };

  generateDates = () => {};

  render() {
    return (
      <RVTable
        width={300}
        height={300}
        headerHeight={20}
        rowHeight={30}
        rowCount={this.state.dates.length}
        rowGetter={({ index }) => this.state.dates[index]}
      >
        <Column label="Departure" dataKey="departure" width={100} />
        <Column width={200} label="Arrival" dataKey="arrival" />
        <Column label="Number of Days Away" dataKey="away" width={100} />
      </RVTable>
    );
  }
}
export default Table;
