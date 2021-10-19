import React, { useState } from 'react';
//can change this icon later on to our logo
import { Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';

import globalStyles from './globalStyling.module.css';

import DayPicker from 'react-day-picker';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';

//import DatePicker from 'react-datepicker';
//import 'react-datepicker/dist/react-datepicker.css';
//import 'react-datepicker/dist/react-datepicker-cssmodules.css';

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
    width: '100%',
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

const DefaultDayPicker = (props) => {
  const classes = useStyles();

  return (
    <div>
      {/*<Paper variant="outlined" elevation0="true" className={classes.invisPaper}>
        <style>{birthdayStyle}</style>
        <DayPicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          showTimeSelect
          dateFormat="Pp"
          className={classes.dayPicker}
          {...props}
        />
      </Paper>*/}
      <style>{calendar}</style>
      <Calendar
        className={classes.calendar}
        color="#B1EB3B"
        //minDate={new Date()}
        //  change this to be something else for max or not at all
        //maxDate={new Date(2021, 7, 27)}
        {...props}
      />
    </div>
  );
};
export default DefaultDayPicker;

/*export default class MyForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleDayChange = this.handleDayChange.bind(this);
    this.state = {
      selectedDay: undefined,
    };
  }

  handleDayChange(day) {
    this.setState({ selectedDay: day });
  }

  render() {
    const { selectedDay } = this.state;
    return (
      <div>
        {selectedDay && <p>Day: {selectedDay.toLocaleDateString()}</p>}
        {!selectedDay && <p>Choose a day</p>}
        <DayPickerInput onDayChange={this.handleDayChange} />
      </div>
    );
  }
}*/
