import React from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import { momentObj } from 'react-moment-proptypes';

import 'react-datepicker/dist/react-datepicker.css';
import './options.css';

const Options = ({
  endDate, maxDays, onOptionChange, onSave, startDate, timePeriod
}) => (
  <div id="options">
    <h2 className="sub-heading">Options</h2>
    <div className="option">
      <p>Time Period</p>
      <input value={timePeriod} onChange={e => onOptionChange('timePeriod', e.target.value)} />
    </div>
    <div className="option">
      <p>Maximum Days out of Country</p>
      <input value={maxDays} onChange={e => onOptionChange('maxDays', e.target.value)} />
    </div>
    <div className="option">
      <p>Start Date</p>
      <DatePicker
        selected={startDate}
        dateFormat="DD-MM-YYYY"
        onChange={date => onOptionChange('startDate', date)}
      />
    </div>
    <div className="option">
      <p>End Date</p>
      <DatePicker
        selected={endDate}
        dateFormat="DD-MM-YYYY"
        onChange={date => onOptionChange('endDate', date)}
      />
    </div>
    <button onClick={onSave}>Save Options</button>
  </div>
);

Options.propTypes = {
  endDate: momentObj.isRequired,
  maxDays: PropTypes.number.isRequired,
  onOptionChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  startDate: momentObj.isRequired,
  timePeriod: PropTypes.number.isRequired
};

export default Options;
