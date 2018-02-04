import React, { Component } from "react";

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
    timePeriod: 5
  };

  changeOptionValue = (name, value) => {
    console.log(value);
    const parsedVal = value === "" ? 0 : parseInt(value, 10);
    this.setState(
      () => ({
        [name]: parsedVal
      }),
      () => {
        this.calculateResult();
      }
    );
  };

  calculateResult = () => {
    const awayOverMax = checkDates(
      new Date("2017-11-17"),
      new Date(),
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
          maxDays={this.state.maxDays}
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
