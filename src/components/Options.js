import React from "react";
import PropTypes from "prop-types";

const Options = props => {
  return (
    <div className="options">
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
    </div>
  );
};

Options.propTypes = {
  maxDays: PropTypes.number.isRequired,
  onOptionChange: PropTypes.func.isRequired,
  timePeriod: PropTypes.number.isRequired
};

export default Options;
