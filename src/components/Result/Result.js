import React from "react";
import PropTypes from "prop-types";

import "./result.css";

const Result = props => {
  return (
    <div id="result">
      {props.awayOverMax && (
        <h3>
          Oh dear, you were away for more than {props.maxDays} days in a{" "}
          {props.timePeriod} day period.
        </h3>
      )}
      {!props.awayOverMax && (
        <h3>
          Well done, you weren't away for more than {props.maxDays} days in a{" "}
          {props.timePeriod} day period.
        </h3>
      )}
    </div>
  );
};

Result.propTypes = {
  awayOverMax: PropTypes.bool.isRequired,
  maxDays: PropTypes.number.isRequired,
  timePeriod: PropTypes.number.isRequired
};

export default Result;
