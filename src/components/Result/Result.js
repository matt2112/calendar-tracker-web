import React from 'react';
import PropTypes from 'prop-types';

import './result.css';

const Result = props => (
  <div id="result">
    {props.awayOverMax[0] && (
      <h3>
        Oh dear, you were away for {props.awayOverMax[1]} days in a {props.timePeriod} day period,
        but the maximum is {props.maxDays}.
      </h3>
    )}
    {!props.awayOverMax[0] && (
      <h3>
        Well done, you weren&apos;t away for more than {props.maxDays} days in a {props.timePeriod}{' '}
        day period.
      </h3>
    )}
  </div>
);

Result.propTypes = {
  awayOverMax: PropTypes.arrayOf(PropTypes.boolean, PropTypes.number).isRequired,
  maxDays: PropTypes.number.isRequired,
  timePeriod: PropTypes.number.isRequired
};

export default Result;
