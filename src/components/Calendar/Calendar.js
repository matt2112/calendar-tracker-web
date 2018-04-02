import React from 'react';
import PropTypes from 'prop-types';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import './calendar.css';
import { ABROAD } from '../../constants';

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

const Calendar = props => (
  <div id="calendar">
    <h2 className="sub-heading">Dates Away</h2>
    <BigCalendar
      {...props}
      events={props.datesAway}
      views={['month']}
      step={60}
      // React Big Calendar can't seem to process dates as moment objects.
      defaultDate={new Date()}
      selectable
      onSelectSlot={props.onAddOrRemoveDate}
      onSelectEvent={props.onAddOrRemoveDate}
      eventPropGetter={eventStyleGetter}
    />
    <button onClick={props.onSave}>Save Dates</button>
  </div>
);

Calendar.propTypes = {
  datesAway: PropTypes.arrayOf(
    PropTypes.shape({
      allDay: PropTypes.bool.isRequired,
      end: PropTypes.object.isRequired,
      id: PropTypes.number.isRequired,
      start: PropTypes.object.isRequired,
      title: PropTypes.string.isRequired
    })
  ).isRequired,
  onAddOrRemoveDate: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired
};

export default Calendar;
