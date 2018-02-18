import React from "react";
import PropTypes from "prop-types";
import BigCalendar from "react-big-calendar";
import moment from "moment";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "./Calendar.css";

BigCalendar.momentLocalizer(moment);

const Calendar = props => {
  return (
    <div className="calendar">
      <h2 className="sub-heading">Dates Away</h2>
      <BigCalendar
        {...props}
        events={props.datesAway}
        views={["month"]}
        step={60}
        defaultDate={new Date()}
        selectable
        onSelectSlot={props.onAddOrRemoveDate}
        onSelectEvent={props.onAddOrRemoveDate}
      />
    </div>
  );
};

Calendar.propTypes = {
  datesAway: PropTypes.array.isRequired,
  onAddOrRemoveDate: PropTypes.func.isRequired
};

export default Calendar;
