import React from 'react';
import PropTypes from 'prop-types';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import './calendar.css';

BigCalendar.momentLocalizer(moment);

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
    />
    <button onClick={props.onSave}>Save Dates</button>
  </div>
);

Calendar.propTypes = {
  datesAway: PropTypes.array.isRequired,
  onAddOrRemoveDate: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired
};

export default Calendar;
