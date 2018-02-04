import React, { Component } from "react";
import moment from "moment";

import "./App.css";
import Options from "./components/Options";
import Result from "./components/Result";
import checkDates from "./algorithm";
import data from "./algorithm/data";

class App extends Component {
  state = {
    awayOverMax: false,
    data,
    maxDays: 4,
    timePeriod: 5,
    startDate: moment(),
    endDate: moment()
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
    const awayOverMax = checkDates(
      this.state.startDate,
      this.state.endDate,
      data,
      this.state.timePeriod,
      this.state.maxDays
    );

    console.log("away over max", awayOverMax);

    this.setState(() => ({
      awayOverMax
    }));
  };

  render() {
    console.log("RENDER", this.state);
    return (
      <div className="App">
        <h1 className="title">Calendar Tracker</h1>
        <Options
          endDate={this.state.endDate}
          maxDays={this.state.maxDays}
          startDate={this.state.startDate}
          timePeriod={this.state.timePeriod}
          onOptionChange={this.changeOptionValue}
        />
        <Result
          awayOverMax={this.state.awayOverMax}
          maxDays={this.state.maxDays}
          timePeriod={this.state.timePeriod}
        />
      </div>
    );
  }
}

export default App;
