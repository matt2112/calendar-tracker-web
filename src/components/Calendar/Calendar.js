import React from 'react';
import PropTypes from 'prop-types';
import BigCalendar from 'react-big-calendar';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-datepicker/dist/react-datepicker.css';
import './calendar.css';
import { ABROAD, TRAVELLING } from '../../constants';

BigCalendar.momentLocalizer(moment);

const eventStyleGetter = (event) => {
  let style;
  if (event.title === ABROAD) {
    style = {
      backgroundColor: 'rgb(145, 46, 46)'
    };
  }
  return { style };
};

const highlightDates = (datesAway) => {
  const abroadDates = datesAway
    .filter(date => date.title === ABROAD)
    .map(date => moment(date.start));
  const travellingDates = datesAway
    .filter(date => date.title === TRAVELLING)
    .map(date => moment(date.start));

  return [
    {
      'react-datepicker__day--highlighted-custom-1': abroadDates
    },
    {
      'react-datepicker__day--highlighted-custom-2': travellingDates
    }
  ];
};

const Calendar = props => (
  <div id="calendar">
    <div id="top">
      <h2 className="sub-heading">Dates Away</h2>
      <div id="navContainer">
        <h3>Navigate: </h3>
        <DatePicker
          selected={moment(props.currentDate)}
          dateFormat="DD-MM-YYYY"
          onChange={date => props.onNavigate(new Date(date))}
          showYearDropdown
          scrollableYearDropdown
          yearDropdownItemNumber={4}
          highlightDates={highlightDates(props.datesAway)}
        />
      </div>
      <button id="saveDates" onClick={props.onSave}>
        Save Dates
      </button>
    </div>
    <div id="result">
      {props.awayOverMax[0] && (
        <h3>
          Oh dear, you were away for {props.awayOverMax[1]} days in a {props.timePeriod} day period,
          but the maximum is {props.maxDays}.
        </h3>
      )}
      {!props.awayOverMax[0] && (
        <h3>
          Well done, you weren&apos;t away for more than {props.maxDays} days in a{' '}
          {props.timePeriod} day period.
        </h3>
      )}
    </div>
    <BigCalendar
      {...props}
      events={props.datesAway}
      views={['month']}
      step={60}
      // React Big Calendar can't seem to process dates as moment objects.
      // defaultDate={new Date()}
      selectable
      onSelectSlot={props.onAddOrRemoveDate}
      onSelectEvent={props.onAddOrRemoveDate}
      eventPropGetter={eventStyleGetter}
      date={props.currentDate}
      onNavigate={date => props.onNavigate(date)}
    />
  </div>
);

Calendar.propTypes = {
  awayOverMax: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.bool, PropTypes.number]))
    .isRequired,
  currentDate: PropTypes.object.isRequired,
  datesAway: PropTypes.arrayOf(
    PropTypes.shape({
      allDay: PropTypes.bool.isRequired,
      end: PropTypes.object.isRequired,
      id: PropTypes.number.isRequired,
      start: PropTypes.object.isRequired,
      title: PropTypes.string.isRequired
    })
  ).isRequired,
  maxDays: PropTypes.number.isRequired,
  onAddOrRemoveDate: PropTypes.func.isRequired,
  onNavigate: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  timePeriod: PropTypes.number.isRequired
};

export default Calendar;
