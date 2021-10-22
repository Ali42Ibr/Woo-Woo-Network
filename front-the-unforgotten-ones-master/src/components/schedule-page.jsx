import React, { useState } from 'react';
//import { useHistory } from 'react-router-dom';
//can change this icon later on to our logo
import {
  Paper,
  CssBaseline,
  Box,
  Typography,
  Grid,
  List,
  ListItem,
  makeStyles,
  withStyles,
} from '@material-ui/core';
import PageTitle from './comps/pgTitle';
//import DefaultDayPicker from './comps/defDayPicker';
import Copyright from './copyright';
import globalStyles from './comps/globalStyling.module.css';
import PropTypes from 'prop-types';
import SmallClearButton from './comps/smlClearButton';
import DefaultButton from './comps/defButton';
import { Button } from '@material-ui/core';
import MoreButton from './comps/moreButton';
import AddIcon from '@material-ui/icons/Add';
import SaveButton from './comps/saveButton';
import DeleteButton from './comps/delButton';
import SmallTextField from './comps/smlTextField';
import DeleteIcon from '@material-ui/icons/Delete';
import SmallButton from './comps/smlButton';
//import DateFnsUtils from '@date-io/date-fns';
//import KeyboardTimePicker from '@material-ui/pickers';
import ReactDOM from 'react-dom';
//import DefaultDayPicker from './comps/defDayPicker';

import { Calendar } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

// User token
const aToken = sessionStorage.getItem('token');

// Moment Library used for date formating and timezone
const moment = require('moment-timezone');

// Global state for schedules in order to access it and change it between multiple components
const initialGlobalState = {
  schedules: [],
};

const GlobalStateContext = React.createContext(initialGlobalState);
const DispatchStateContext = React.createContext(undefined);

/**
 * Global State provider & hooks
 */
const GlobalStateProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(
    (state, newValue) => ({ ...state, ...newValue }),
    initialGlobalState
  );
  return (
    <GlobalStateContext.Provider value={state}>
      <DispatchStateContext.Provider value={dispatch}>
        {children}
      </DispatchStateContext.Provider>
    </GlobalStateContext.Provider>
  );
};

const useGlobalState = () => [
  React.useContext(GlobalStateContext),
  React.useContext(DispatchStateContext),
];

const useStyles = makeStyles((theme) => ({
  dayBox: {
    padding: theme.spacing(1, 2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    width: '100%',
  },
  dayTitle: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scheduleButtons: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendar: {
    width: '100%',
    borderRadius: '4px !important',
    backgroundColor: '#fff3e0 !important',
    border: '1px solid #f26924 !important',
  },
}));

const ScheduleManager = (props) => {
  const classes = useStyles();
  // Props: i have startdate and enddate

  const [state, dispatch] = useGlobalState();

  React.useEffect(() => {
    // Get a schedule list of current healer user. Only get schedule for 7 days maximum.
    (async () => {
      try {
        const response = await fetch(
          process.env.REACT_APP_API_DOMAIN +
            '/schedules?startDate=' +
            moment(props.startDate).format('YYYY-MM-DD') +
            '&endDate=' +
            moment(props.endDate).format('YYYY-MM-DD') +
            '&timezone=' +
            moment.tz.guess(),
          {
            method: 'GET',
            headers: {
              Authorization: 'Bearer ' + aToken,
              'Content-Type': 'application/json',
            },
          }
        );
        if (!response.ok)
          throw Error(response.status + ': ' + response.statusText); // error checking, is the data okay?
        const data = await response.json(); // transform the data from string into JSON format.
        // HERE WE SAVE THE  DATES TO THE CONTEXT VARIABLE
        dispatch({ schedules: data });
      } catch (Error) {
        console.log(Error);
      }
    })();
  }, props);

  return (
    <Box className={`${classes.Box} ${globalStyles.list}`}>
      {state.schedules.map((day, i) => (
        <ScheduleManager_Day
          key={day.date}
          date={day.date}
          periods={day.periods}
          index={i}
        />
      ))}
    </Box>
  );
};

const ScheduleManager_Day = (props) => {
  const classes = useStyles();

  const [state, dispatch] = useGlobalState();

  // i have date, periods array and index of each day

  // period list for a day
  const [periodList, setPeriodList] = useState([getPeriods(props.periods)]);

  // handle click event of the Add button
  const addPeriod = () => {
    console.log('add period');
    setPeriodList([
      ...periodList,
      <Day_TimePeriod
        key={props.periods.length}
        startTime={''}
        endTime={''}
        //index of each single period line will be the last position
        index={props.periods.length}
        weekDay={props.index}
      />,
      // { startTime: '', endTime: '' },
    ]);
  };

  function getPeriods(periods) {
    if (periods.length === 0) {
      return (
        <Day_TimePeriod
          startTime={''}
          endTime={''}
          index={periods.length}
          weekDay={props.index}
          key={periods.length}
        />
      );
    } else {
      return periods.map((element, i) => (
        <Day_TimePeriod
          startTime={element.startTime ? element.startTime : ''}
          endTime={element.endTime ? element.endTime : ''}
          index={i}
          weekDay={props.index}
          key={i}
        />
      ));
    }
  }

  return (
    <Paper
      square
      className={
        props.index % 2
          ? `${classes.Paper} ${globalStyles.listEven}`
          : `${classes.Paper} ${globalStyles.listOdd}`
      }
    >
      <Box className={classes.dayBox}>
        <div className={classes.dayTitle}>
          <Typography variant="h6">
            {moment(props.date).format('dddd')}
          </Typography>
          <Typography
            variant="body1"
            style={{
              marginLeft: '8px',
              marginRight: '8px',
            }}
          >
            -
          </Typography>
          {/* change this  */}
          <Typography variant="body2">
            {moment(props.date).format('MMM Do')}
          </Typography>
        </div>
        {periodList}
        <SmallButton
          onClick={addPeriod}
          endIcon={<AddIcon />}
          contents="Add Time Period"
        />
      </Box>
    </Paper>
  );
};

const Day_TimePeriod = (props) => {
  const classes = useStyles();
  const [state, dispatch] = useGlobalState();
  const [inputList, setInputList] = useState([
    { startTime: props.startTime, endTime: props.endTime },
  ]);

  // PROPS: i have start and end and index of the period and week day

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...inputList];
    list[index][name] = value;
    setInputList(list);

    const newSchedule = state.schedules.slice(); //copy the array
    const dayPeriods = newSchedule[props.weekDay].periods.slice(); //copy the periods array of a day
    //check for index of period before pushing
    if (
      props.index != props.index - 1 &&
      list[0].startTime != '' &&
      list[0].endTime != ''
    ) {
      dayPeriods[props.index] = list[0];
    }
    newSchedule[props.weekDay].periods = dayPeriods;
    newSchedule[props.weekDay].periods.filter(function (el) {
      return el != null;
    });
    dispatch({ schedules: newSchedule }); //set the new state
  };

  // handle click event of the Remove button
  const handleRemoveClick = (index) => {
    const list = [...inputList];
    list.splice(index, 1);
    setInputList(list);
    const newSchedule = state.schedules.slice(); //copy the array
    const dayPeriods = newSchedule[props.weekDay].periods.slice(); //copy the periods array of a day
    if (props.index != props.index - 1) {
      const resulting = [
        ...dayPeriods.slice(0, props.index),
        ...dayPeriods.slice(props.index + 1),
      ];
      newSchedule[props.weekDay].periods = resulting;
    }
    newSchedule[props.weekDay].periods.filter(function (el) {
      return el != null;
    });
    dispatch({ periods: newSchedule }); //set the new state
  };
  return (
    <div>
      {inputList.map((x, i) => {
        return (
          <Grid container spacing={1} key={i + x}>
            <Grid item xs={5}>
              <SmallTextField
                fullWidth
                type="time"
                //defaultValue={props.startTime ? props.startTime : ''}
                onChange={(e) => handleInputChange(e, i)}
                name="startTime"
                value={x.startTime}
              />
            </Grid>
            <Grid item xs={5}>
              <SmallTextField
                fullWidth
                type="time"
                //defaultValue={props.endTime ? props.endTime : ''}
                onChange={(e) => handleInputChange(e, i)}
                name="endTime"
                value={x.endTime}
              />
            </Grid>
            <Grid
              item
              xs={2}
              className={`${classes.Grid} ${globalStyles.centerItems}`}
            >
              {/* DELETE A PERIOD */}
              <SmallClearButton
                margin="dense"
                fullWidth
                contents={<DeleteIcon />}
                style={{
                  padding: '4px',
                  minWidth: 0,
                  marginLeft: 0,
                  marginRight: 0,
                }}
                onClick={() => handleRemoveClick(i)}
              />
            </Grid>
          </Grid>
        );
      })}
    </div>
  );
};

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

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(
    new Date(new Date().setTime(startDate.getTime() + 6 * 86400000))
  );

  const [date, setDate] = useState(new Date());

  function handleDateSelected(dateSelected) {
    setDate(dateSelected);
    setStartDate(dateSelected);
    setEndDate(
      new Date(endDate.setTime(dateSelected.getTime() + 6 * 86400000))
    );
  }

  return (
    <Box style={{ width: '100%' }}>
      <style>{calendar}</style>
      <Calendar
        className={classes.calendar}
        color="#B1EB3B"
        date={date}
        onChange={(date) => handleDateSelected(date)}
        minDate={new Date()}
        maxDate={new Date(new Date().setMonth(new Date().getMonth() + 3))}
      />
      {/* START DATE AND END DATE NEED TO BE PASSED */}
      <ScheduleManager key={date} startDate={startDate} endDate={endDate} />
    </Box>
  );
};

const SaveDelete = (props) => {
  const classes = useStyles();
  const data = {
    schedules: [],
    timezone: '',
  };
  const [state, dispatch] = useGlobalState();

  data.schedules = state.schedules;
  data.timezone = moment.tz.guess();

  function handleDelete(e) {
    e.preventDefault();

    const myDataObject = {
      startDate: data.schedules[0].date,
      endDate: data.schedules[6].date,
      timezone: data.timezone,
    };

    (async () => {
      try {
        const response = await fetch(
          process.env.REACT_APP_API_DOMAIN + '/schedules/',
          {
            method: 'DELETE',
            mode: 'cors',
            headers: {
              Authorization: 'Bearer ' + aToken,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(myDataObject),
          }
        );
        if (response.status == 200 || response.status == 204) {
          alert('Your schedule was successfully deleted.');
          window.location.reload();
        } else {
          alert('Problem with deleting schedule. Check all fields.');
        }
      } catch (error) {
        console.log('Fetch API error - post' + error);
      }
    })();
  }

  function handleSave(e) {
    e.preventDefault();
    (async () => {
      try {
        const response = await fetch(
          process.env.REACT_APP_API_DOMAIN + '/schedules/',
          {
            method: 'POST',
            mode: 'cors',
            headers: {
              Authorization: 'Bearer ' + aToken,
              'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify(data),
          }
        );
        if (response.status == 200) {
          alert('Your schedule was updated.');
          window.location.reload();
        } else {
          alert('Can not update schedule within one week.');
        }
      } catch (error) {
        console.log('Fetch API error - POST' + error);
      }
    })();
  }

  return (
    <div style={{ display: 'flex' }}>
      {/* SAVE SCHEDULE */}
      <form onSubmit={handleSave}>
        <SaveButton contents="Save Schedule" type="submit" />
      </form>
      <form onSubmit={handleDelete}>
        <DeleteButton type="submit" />
      </form>
    </div>
  );
};

function SchedulePage(props) {
  const classes = props;

  return (
    <GlobalStateProvider>
      <div>
        <Paper className={`${classes.Paper} ${globalStyles.smlPgContainer}`}>
          <CssBaseline />
          <div className={`${classes.div} ${globalStyles.centerItems}`}>
            <PageTitle contents="Manage Schedule" />
            <DefaultDayPicker />
            <SaveDelete />
          </div>
        </Paper>
        <Copyright />
      </div>
    </GlobalStateProvider>
  );
}
SchedulePage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default SchedulePage;
