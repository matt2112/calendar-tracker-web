import React, { Component, Fragment } from "react";
import moment from "moment";

import "./app.css";
import Options from "./components/Options/Options";
import Result from "./components/Result/Result";
import Calendar from "./components/Calendar/Calendar";
import Login from "./components/Login/Login";
import checkDates from "./algorithm";

class App extends Component {
  state = {
    awayOverMax: false,
    maxDays: 4,
    timePeriod: 5,
    startDate: moment().subtract(1, "year"),
    endDate: moment(),
    datesAway: [],
    signingUp: false,
    loggedIn: false
  };

  changeOptionValue = (name, value) => {
    console.log(value);
    let formattedValue;
    if (name === "maxDays" || name === "timePeriod") {
      formattedValue = value === "" ? 0 : parseInt(value, 10);
    } else {
      // Otherwise is a date.
      formattedValue = value;
    }

    this.setState(
      () => ({
        [name]: formattedValue
      }),
      () => {
        this.calculateResult();
      }
    );
  };

  calculateResult = () => {
    const datesArray = this.state.datesAway.map(date => date.start);
    const awayOverMax = checkDates(
      this.state.startDate,
      this.state.endDate,
      datesArray,
      this.state.timePeriod,
      this.state.maxDays
    );

    this.setState(() => ({
      awayOverMax
    }));
  };

  addOrRemoveDate = dateInfo => {
    const newDatesAway = [...this.state.datesAway];
    const indicesToSplice = [];
    const datesToAdd = [];
    if (dateInfo.slots) {
      dateInfo.slots.forEach(date => {
        const existingDateIdx = this.state.datesAway.findIndex(oldDate => {
          return oldDate.start.toDateString() === date.toDateString();
        });
        if (existingDateIdx === -1) {
          datesToAdd.push({
            id: Math.random(),
            title: "Away",
            allDay: true,
            start: date,
            end: date
          });
        } else {
          indicesToSplice.push(existingDateIdx);
        }
      });
      // Otherwise single existing event selected.
    } else {
      const existingDateIdx = this.state.datesAway.findIndex(oldDate => {
        return oldDate.start.toDateString() === dateInfo.start.toDateString();
      });
      indicesToSplice.push(existingDateIdx);
    }

    const updatedDates = newDatesAway.filter(
      (val, idx) => indicesToSplice.indexOf(idx) === -1
    );

    datesToAdd.forEach(date => updatedDates.push(date));

    this.setState(
      prevState => ({
        datesAway: updatedDates
      }),
      () => this.calculateResult()
    );
  };

  login = () => {
    this.setState({
      loggedIn: true
    });
  };

  switchLoginType = () => {
    this.setState(prevState => ({
      signingUp: !prevState.signingUp
    }));
  };

  render() {
    return (
      <div id="app">
        <h1 className="title">Calendar Tracker</h1>
        {!this.state.loggedIn && (
          <Login
            signingUp={this.state.signingUp}
            onLogin={this.login}
            onSwitchLoginType={this.switchLoginType}
          />
        )}
        {this.state.loggedIn && (
          <Fragment>
            <Options
              endDate={this.state.endDate}
              maxDays={this.state.maxDays}
              startDate={this.state.startDate}
              timePeriod={this.state.timePeriod}
              onOptionChange={this.changeOptionValue}
            />
            <Calendar
              endDate={this.state.endDate}
              startDate={this.state.startDate}
              datesAway={this.state.datesAway}
              onAddOrRemoveDate={this.addOrRemoveDate}
            />
            <Result
              awayOverMax={this.state.awayOverMax}
              maxDays={this.state.maxDays}
              timePeriod={this.state.timePeriod}
            />
          </Fragment>
        )}
      </div>
    );
  }
}

export default App;
