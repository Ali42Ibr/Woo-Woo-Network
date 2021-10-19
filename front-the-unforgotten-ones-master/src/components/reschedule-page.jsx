import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
//can change this icon later on to our logo
import { Paper, CssBaseline, makeStyles } from '@material-ui/core';
import PageTitle from './comps/pgTitle';
import Copyright from './copyright';
import globalStyles from './comps/globalStyling.module.css';
import DefaultButton from './comps/defButton';
import TimeSelector from './reschedule-timeslot';
import DefaultDayPicker from './comps/default-day-picker';
import moment from 'moment-timezone';

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
  noticeAndButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
}));

const NoticeAndButton = (props) => {
  const classes = useStyles();

  if (props.isHealer) {
    return (
      <DefaultButton
        fullWidth
        contents="Send Request"
        onClick={props.sendHealerRequest}
      />
    );
  } else {
    return (
      <div className={classes.noticeAndButton}>
        <DefaultButton
          fullWidth
          contents="Reschedule"
          onClick={props.sendClientRequest}
        />
      </div>
    );
  }
};

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function ReschedulePage() {
  const history = useHistory();
  const query = useQuery();
  const healerId = query.get('healer');
  const appointmentId = query.get('appointmentId');
  const healerRequest = query.get('healerRequest');
  const time = query.get('time');
  const timezone = moment.tz.guess();
  const token = sessionStorage.getItem('token');

  if (!healerId || !appointmentId) {
    history.push('/account');
    alert('Do not have appointmentId or healerId');
  }

  // get date range state
  const [date, setDate] = useState(new Date());

  const [availableTimes, setAvailableTimes] = useState([]);

  const [chosenSlot, setChosenSlot] = useState(null);

  useEffect(() => {
    // get the startDate and endDate from the backend here
    const startDate = moment(date).startOf('week').format('YYYY-MM-DD');
    const endDate = moment(date).endOf('week').format('YYYY-MM-DD');
    // get the available times from the backend here
    getAvailableTimes({ startDate, endDate, timezone, healerId });
  }, [date]);

  useEffect(() => {
    //console.log(chosenSlot);
    // only validate if it's not null
    if (chosenSlot) {
      // validate slot here
      const chosenTimeStart = moment(chosenSlot.slot).tz(moment.tz.guess());
      const chosenTimeEnd = chosenTimeStart.add(time, 'minutes');
      // invalid => set null
      const bookTime = availableTimes[chosenSlot.index].bookedSlots;
      for (let i = 0; i < bookTime.length; i++) {
        if (
          moment(bookTime[i].sessionTime).isBetween(
            chosenTimeStart,
            chosenTimeEnd
          ) ||
          moment(bookTime[i].sessionTime)
            .add(bookTime[i].timeLength, 'minutes')
            .isBetween(chosenTimeStart, chosenTimeEnd)
        ) {
          setChosenSlot(null);
          alert(
            'There is an overlapping time here. Please choose another time'
          );
          break;
        }
      }
    }
  }, [chosenSlot]);
  const onDateChange = (date) => {
    //console.log(date);
    setDate(date);
  };

  const getAvailableTimes = async ({
    healerId,
    startDate,
    endDate,
    timezone,
  }) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_DOMAIN}/appointments/available?startDate=${startDate}&endDate=${endDate}&healer=${healerId}&timezone=${timezone}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json;charset=utf-8',
          },
        }
      );
      if (res.status === 200) {
        // get data from the response
        const data = await res.json();
        console.log(data);
        setAvailableTimes(data);
      } else {
        alert('Bad request');
        history.push('/account');
      }
    } catch (error) {
      console.log(error);
    }
  };
  const sendHealerRequest = async () => {
    // check if chosen slot is valid (not null)
    if (chosenSlot == null) {
      alert('Please choose a slot to submit');
    }
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_DOMAIN}/appointments/${appointmentId}/request/reschedule`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json;charset=utf-8',
          },
          body: JSON.stringify({
            id: appointmentId,
            timeSlot: chosenSlot.slot,
            date: availableTimes[chosenSlot.index].date,
            timezone,
          }),
        }
      );
      if (res.status === 200) {
        alert('Request sent');
        history.push('/account');
      } else {
        console.log(res);
        alert('Bad request. Choose another time.');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const sendClientRequest = async () => {
    // check if chosen slot is valid (not null)
    if (chosenSlot == null) {
      alert('Please choose a slot to submit');
    }
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_DOMAIN}/appointments/${appointmentId}/reschedule`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json;charset=utf-8',
          },
          body: JSON.stringify({
            id: appointmentId,
            timeSlot: chosenSlot.slot,
            date: availableTimes[chosenSlot.index].date,
            timezone,
          }),
        }
      );
      if (res.status === 200) {
        alert('Request sent');
        history.push('/account');
      } else {
        console.log(res);
        alert('Bad request. Choose another time');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Paper className={`${globalStyles.smlPgContainer}`}>
        <CssBaseline />
        <div className={`${globalStyles.centerItems}`}>
          <PageTitle contents="Reschedule" />
          <DefaultDayPicker
            minDate={new Date()}
            date={date}
            onChange={onDateChange}
          />
          <TimeSelector
            availableTimes={availableTimes}
            setSlot={setChosenSlot}
          />
          <NoticeAndButton
            style={{ marginTop: '16px' }}
            isHealer={healerRequest}
            sendClientRequest={sendClientRequest}
            sendHealerRequest={sendHealerRequest}
          />
        </div>
      </Paper>
      <Copyright />
    </div>
  );
}

export default ReschedulePage;
