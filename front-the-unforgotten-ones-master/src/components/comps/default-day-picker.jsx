import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core';

import 'react-day-picker/lib/style.css';

import { Calendar } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

const useStyles = makeStyles((theme) => ({
  dayPicker: {
    color: '#000000',
  },
  paper: {
    backgroundColor: theme.palette.background.orange,
  },
  invisPaper: {
    backgroundColor: 'transparent',
  },
  calendar: {
    borderRadius: '4px !important',
    backgroundColor: '#fff3e0 !important',
    border: '1px solid #f26924 !important',
  },
}));

const birthdayStyle = `.DayPicker-Day--highlighted {
  background-color: orange;
  color: white;
}`;

const calendar = `.rdrNextPrevButton {
  background-color: #CEFA3E;
  min-width: 24px;
}
.rdrNextPrevButton:hover {
  background-color: #faeb3e;
}
.rdrCalendarWrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 100%;
  max-width: 100%;
  margin: auto;
}
.rdrDateDisplayWrapper {
  width: 100%;
}
.rdrMonthAndYearWrapper {
  width: 100%;
  justify-content: center;
  align-items: center;
}
.rdrMonths {
  width: 100%;
}
.rdrMonthsVertical {
  width: 100%;
}
.rdrMonth {
  width: 100%;
}
.rdrWeekDays {}
.rdrWeekDay {
  color: black;
}
.rdrDays {}
.rdrDay {}
.rdrDayNumber {
  color: #B1EB3B;
}
.rdrDayNumber span {
  color: black;
}
.rdrMonthAndYearPickers {
  display: flex;
}
.rdrYearPicker {
  margin: 0;
  flex-grow: 2;
  min-width: 0;
}
.rdrYearPicker select {
  width: 100%;
}
.rdrMonthPicker {
  margin: 0;
  flex-grow: 4;
  min-width: 0;
}
.rdrMonthPicker select {
  width: 100%;
}`;

const DefaultDayPicker = ({ minDate, maxDate, date, onChange }) => {
  const classes = useStyles();

  return (
    <div style={{ width: '100%' }}>
      <style>{calendar}</style>
      <Calendar
        date={date}
        onChange={onChange}
        className={classes.calendar}
        color="#B1EB3B"
        minDate={minDate}
        //  change this to be something else for max or not at all
        maxDate={maxDate}
      />
    </div>
  );
};
export default DefaultDayPicker;
