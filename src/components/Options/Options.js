import React from "react";
import PropTypes from "prop-types";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import "./options.css";

const Options = props => {
  return (
    <div id="options">
      <h2 className="sub-heading">Options</h2>
      <div className="option">
        <p>Time Period</p>
        <input
          value={props.timePeriod}
          onChange={e => props.onOptionChange("timePeriod", e.target.value)}
        />
      </div>
      <div className="option">
        <p>Maximum Days out of Country</p>
        <input
          value={props.maxDays}
          onChange={e => props.onOptionChange("maxDays", e.target.value)}
        />
      </div>
      <div className="option">
        <p>Start Date</p>
        <DatePicker
          selected={props.startDate}
          onChange={date => props.onOptionChange("startDate", date)}
        />
      </div>
      <div className="option">
        <p>End Date</p>
        <DatePicker
          selected={props.endDate}
          onChange={date => props.onOptionChange("endDate", date)}
        />
      </div>
    </div>
  );
};

Options.propTypes = {
  maxDays: PropTypes.number.isRequired,
  onOptionChange: PropTypes.func.isRequired,
  timePeriod: PropTypes.number.isRequired
};

export default Options;
