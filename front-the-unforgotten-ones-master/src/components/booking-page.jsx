import Media from 'react-media';
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
  useMediaQuery,
} from '@material-ui/core';
import PageTitle from './comps/pgTitle';
//import DefaultDayPicker from './comps/defDayPicker';
import Copyright from './copyright';
import globalStyles from './comps/globalStyling.module.css';
import PropTypes from 'prop-types';
import SmallClearButton from './comps/smlClearButton';
import DefaultButton from './comps/defButton';
import { Button } from '@material-ui/core';
import jwt_decode from 'jwt-decode';
import { useParams } from 'react-router-dom';

import { Calendar } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

// Moment Library used for date formating and timezone
const moment = require('moment-timezone');

const useStyles = makeStyles((theme) => ({
  timeContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  slotOdd: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'start',
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.25)',
    zIndex: 1,
    width: '100%',
  },
  slotEven: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'start',
    backgroundColor: theme.palette.background.orange,
    boxShadow: '0 2px 2px rgba(0, 0, 0, 0.2)',
    width: '100%',
  },
  timeButton_Even: {
    minWidth: 0,
    borderRadius: 0,
    '&:hover': {
      backgroundColor: '#faeb3e',
    },
  },
  timeButton_Odd: {
    minWidth: 0,
    borderRadius: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    '&:hover': {
      backgroundColor: '#faeb3e',
    },
  },
  weekText: {
    textAlign: 'center',
  },
  narrowContainer: {
    width: '80%',
    '@media (max-width: 480px)': {
      width: '100%',
    },
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  calendar: {
    width: '100%',
    borderRadius: '4px !important',
    backgroundColor: '#fff3e0 !important',
    border: '1px solid #f26924 !important',
  },
}));

// Global state in order to access it and change it between multiple components
const initialGlobalState = {
  timeSlot: '',
  slotDate: '',
  serviceId: null,
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

const TimeButton = (props) => {
  //PROPS: I have time, the date, index
  const classes = useStyles();
  const [state, dispatch] = useGlobalState();

  const handleClick = () => {
    //console.log('state: ', state);
    state.timeSlot = props.time;
    state.slotDate = moment(props.date).format('YYYY-MM-DD');
    //console.log('state after: ', state);
  };

  return (
    <Button
      onClick={handleClick}
      size="small"
      variant="text"
      fullWidth
      className={
        props.index % 2 ? classes.timeButton_Even : classes.timeButton_Odd
      }
      {...props}
    >
      {props.time}
    </Button>
  );
};

const TimeSelector = (props) => {
  const classes = useStyles();
  const [availableTimeSlots, setSlots] = useState([]);
  // PROPS: startDate , endDate and healerID

  // API Call to retrieve available time slots based on props.

  React.useEffect(() => {
    (async () => {
      try {
        const response = await fetch(
          process.env.REACT_APP_API_DOMAIN +
            '/appointments/available' +
            '?healer=' +
            props.healerID +
            '&startDate=' +
            props.startDate +
            '&endDate=' +
            props.endDate +
            '&timezone=' +
            moment.tz.guess(),
          {
            method: 'GET',
            headers: {
              // no auth header
              'Content-Type': 'application/json',
            },
          }
        );
        if (!response.ok)
          throw Error(response.status + ': ' + response.statusText); // error checking, is the data okay?
        const data = await response.json(); // transform the data (available time slots) from string into JSON format.
        setSlots(() => data);
      } catch (Error) {
        console.log(Error);
      }
    })();
  }, props);

  return (
    <Box className={classes.timeContainer}>
      {/* We are mapping the available time slots for a week period here. We will always have 7 time selectors. */}
      {console.log('time slots')}
      {console.log(availableTimeSlots)}

      {availableTimeSlots.map((day, i) => (
        <TimeSelector_Day
          key={day.date}
          date={day.date}
          availableSlots={day.availableSlots}
          bookedSlots={day.bookedSlots}
          index={i}
        />
      ))}
    </Box>
  );
};

const TimeSelector_Day = (props) => {
  const classes = useStyles();

  // PROPS: I have date, availableSlots, bookedSlots and index.

  return (
    <Paper
      square
      className={props.index % 2 ? classes.slotEven : classes.slotOdd}
    >
      <Typography variant="h6" className={classes.weekText}>
        {moment(props.date).format('ddd')}
      </Typography>
      {
        /* For each available time we will render a time button. */
        console.log(props.availableSlots)
      }
      {props.availableSlots.map((slot, i) =>
        slot != undefined ? (
          <TimeButton key={i} time={slot} index={i} date={props.date} />
        ) : (
          <TimeButton time="-" index={i} disabled key={i} />
        )
      )}
    </Paper>
  );
};

const HealerServices = (props) => {
  const classes = useStyles();
  const [services, setServices] = useState([]);

  React.useEffect(() => {
    (async () => {
      try {
        // fetches the user data for this healer.
        const response = await fetch(
          process.env.REACT_APP_API_DOMAIN +
            '/services?healer=' +
            props.healerID,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        if (!response.ok)
          throw Error(response.status + ': ' + response.statusText); // error checking, is the data okay?
        const data = await response.json(); // transform the data from string into JSON format.
        setServices(() => data);
      } catch (Error) {
        console.log(Error);
      }
    })();
  }, []);

  return (
    <List className={`${classes.List} ${globalStyles.list}`}>
      {/* <ServiceListItem_Selected
        serviceName="Service 1"
        servicePrice="14.99"
        serviceLength="30"
        serviceDescription="Lorem ipsum"
        serviceAvailability={false}
      />
      <ServiceListItem index={1} serviceName="Service 2" servicePrice="24.99" />
      <ServiceListItem index={2} serviceName="Service 3" servicePrice="39.99" /> */}
      {/* THIS WILL BE A MAPPING 
      IF SELECTED RENDER SELECTED 
      THEN INTERCHANGE BETWEEN EVEN AND ODD
      WILL ADD LIMITATION ? MAYBE } */}
      {services.map((service, i) => (
        <ServiceListItem
          index={i}
          id={service.id}
          serviceName={service.name}
          key={service + i}
          servicePrice={service.price}
          serviceLength={service.timeLength}
          serviceDescription={service.description}
          serviceAvailability={service.isAvailableOnline}
        />
      ))}
    </List>
  );
};

const ServiceListItem = (props) => {
  const classes = useStyles();
  const [state, dispatch] = useGlobalState();
  const [showComponent, setShowComponent] = useState(false);

  function handleClick() {
    if (showComponent) {
      setShowComponent(false);
      state.serviceId = null;
    } else {
      setShowComponent(true);
      state.serviceId = props.id;
    }
  }

  return (
    <List>
      <ListItem
        className={
          props.index % 2
            ? `${classes.ListItem} ${globalStyles.listEven}`
            : `${classes.ListItem} ${globalStyles.listOdd}`
        }
        onClick={handleClick}
      >
        <Grid container spacing={0}>
          <Grid item xs={6}>
            <Typography variant="body1">{props.serviceName}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography align="right" variant="body1">
              {props.servicePrice}
            </Typography>
          </Grid>
        </Grid>
      </ListItem>
      {showComponent ? (
        <ServiceListItem_Selected
          serviceName={props.serviceName}
          servicePrice={props.servicePrice}
          serviceLength={props.serviceLength}
          serviceDescription={props.serviceDescription}
          serviceAvailability={props.serviceAvailability}
          serviceID={props.id}
        />
      ) : null}
    </List>
  );
};

const ServiceListItem_Selected = (props) => {
  const classes = useStyles();
  // const [state, dispatch] = useGlobalState();
  // state.serviceID = props.serviceID;
  return (
    <ListItem className={`${classes.ListItem} ${globalStyles.listSelected}`}>
      <Grid container spacing={0}>
        <Grid container spacing={0}>
          <Grid item xs={6} className={classes.transparent}>
            <Typography variant="body1">{props.serviceName}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography align="right" variant="body1">
              ${props.servicePrice}
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs={12} className={classes.transparent}>
          <Typography variant="body1">{props.serviceDescription}</Typography>
        </Grid>
        <Grid item xs={12} className={classes.transparent}>
          <ul>
            <li>
              <Typography variant="body2">
                {props.serviceAvailability
                  ? 'Available Online'
                  : 'Not Available Online'}
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                {props.serviceLength} minutes
              </Typography>
            </li>
          </ul>
        </Grid>
      </Grid>
    </ListItem>
  );
};

const NarrowContainer = (props) => {
  const classes = useStyles();
  const [state, dispatch] = useGlobalState();
  const aToken = sessionStorage.getItem('token');
  // const healerID = window.location.pathname.charAt(
  //   window.location.pathname.length - 1
  // );
  const { id: healerID } = useParams();

  /* need to pass selected time and service , then use the response url */

  function handleBook(e) {
    const myDataObject = {
      healer: healerID,
      timezone: moment.tz.guess(),
      timeSlot: state.timeSlot,
      date: state.slotDate,
      serviceId: state.serviceId,
    };
    console.log(JSON.stringify(myDataObject));
    if (myDataObject.serviceId === null) {
      alert('Please select a service before booking.');
    } else if (myDataObject.timeSlot === '') {
      alert('Please select a time slot before booking.');
    } else {
      (async () => {
        try {
          const response = await fetch(
            process.env.REACT_APP_API_DOMAIN + '/appointments/book',
            {
              method: 'POST',
              mode: 'cors',
              headers: {
                Authorization: 'Bearer ' + aToken,
                'Content-Type': 'application/json;charset=utf-8',
              },
              body: JSON.stringify(myDataObject),
            }
          )
            .then((response) => response.json())
            //Then with the data from the response in JSON...
            .then((data) => {
              window.location.replace(data.checkoutUrl);
            })
            //Then with the error genereted...
            .catch((error) => {
              console.error('Error:', error);
            });
        } catch (error) {
          console.log('Fetch API error - POST' + error);
        }
      })();
    }
  }
  return (
    <div className={classes.narrowContainer}>
      <HealerServices healerID={healerID} />
      <DefaultButton onClick={handleBook} fullWidth contents="Book Now" />
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

  // const healerID = window.location.pathname.charAt(
  //   window.location.pathname.length - 1
  // );
  const { id: healerID } = useParams();
  const [services, setServices] = useState([]);

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

  React.useEffect(() => {
    (async () => {
      try {
        // fetches the user data for this healer.
        const response = await fetch(
          process.env.REACT_APP_API_DOMAIN + '/services?healer=' + healerID,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        if (!response.ok)
          throw Error(response.status + ': ' + response.statusText); // error checking, is the data okay?
        const data = await response.json(); // transform the data from string into JSON format.
        setServices(() => data);
      } catch (Error) {
        console.log(Error);
      }
    })();
  }, []);

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
      {/* <ScheduleManager key={date} startDate={startDate} endDate={endDate} /> */}
      {services.length === 0 ? (
        <Typography variant="body1">
          This healer does not have services to book.
        </Typography>
      ) : (
        <TimeSelector
          key={date}
          startDate={moment(startDate).format('YYYY-MM-DD')}
          endDate={moment(endDate).format('YYYY-MM-DD')}
          healerID={healerID}
        />
      )}
    </Box>
  );
};

function BookingPage(props) {
  const classes = props;

  return (
    <div>
      <Paper className={`${classes.Paper} ${globalStyles.smlPgContainer}`}>
        <CssBaseline />
        <div className={`${classes.div} ${globalStyles.centerItems}`}>
          <PageTitle contents="Booking" />
          <DefaultDayPicker />
          {/* <TimeSelector /> */}
          <NarrowContainer />
        </div>
      </Paper>
      <Copyright />
    </div>
  );
}
BookingPage.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default BookingPage;
