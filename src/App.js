import React, { Component } from "react";

import "./App.css";
import Options from "./components/Options";

class App extends Component {
  state = {
    maxDays: 4,
    timePeriod: 5
  };

  changeOptionValue = (name, value) => {
    console.log(value);
    const parsedVal = value === "" ? 0 : parseInt(value, 10);
    this.setState(() => ({
      [name]: parsedVal
    }));
  };

  render() {
    return (
      <div className="App">
        <h1>Calendar Tracker</h1>
        <Options
          maxDays={this.state.maxDays}
          timePeriod={this.state.timePeriod}
          onOptionChange={this.changeOptionValue}
        />
      </div>
    );
  }
}

export default App;
