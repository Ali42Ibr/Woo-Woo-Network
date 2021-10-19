import React, { useState, useEffect } from 'react';
import './app/app.css';
import { makeStyles, Grid, Typography, ListItem } from '@material-ui/core';

import DefaultDayPicker from './comps/default-day-picker';
import globalStyles from './comps/globalStyling.module.css';
import UpcomingAppointmentList from './upcoming-appointment-list.jsx';
import MoreButton from './comps/moreButton';
import moment from 'moment-timezone';

const useStyles = makeStyles((theme) => ({
  pgNavBar: {
    display: 'flex',
    justifyContent: 'space-evenly',
    marginBottom: theme.spacing(3),
  },
  datePicker: {
    zIndex: 1,
    width: '50%',
  },
}));

const UpcomingAppointments = () => {
  const classes = useStyles();
  const limit = 5;
  // register state
  const [appointmentList, setAppointmentList] = useState([]);
  const [nextIndex, setNextIndex] = useState(0); // last index need to be from 0
  const [displayShowMore, setDisplayShowMore] = useState(true);
  const [requestedDate, setRequestedDate] = useState(null);
  const token = sessionStorage.getItem('token');

  useEffect(() => {
    // get data from server
    getAppointmentList({
      token,
      limit,
      offset: nextIndex,
    });
  }, []);

  const getAppointmentList = async ({ token, date, limit, offset }) => {
    try {
      const params = {
        limit,
        offset,
      };
      if (date) {
        params.date = moment(date).format('YYYY-MM-DD');
        params.timezone = moment.tz.guess();
      }
      const queryParams = new URLSearchParams(params);
      const response = await fetch(
        process.env.REACT_APP_API_DOMAIN +
          '/appointments/upcoming?' +
          queryParams.toString(),
        {
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json;charset=utf-8',
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setAppointmentList((appointmentList) => [...appointmentList, ...data]);
        checkToShowMore(data.length);
        setNextIndex((nextIndex) => nextIndex + data.length);
      } else {
        resetAppointmentList();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkToShowMore = (appointmentListLength) => {
    if (appointmentListLength < limit) {
      setDisplayShowMore(false);
    } else {
      setDisplayShowMore(true);
    }
  };

  const onDayPickerChange = (date) => {
    resetAppointmentList();
    getAppointmentList({ token, date, limit, offset: 0 });
    setRequestedDate(date);
  };

  const resetAppointmentList = () => {
    setAppointmentList([]);
    setNextIndex(0);
  };

  const onCancelAppointment = () => {
    resetAppointmentList();
    getAppointmentList({ token, limit, offset: 0 });
  };

  return (
    <Grid container>
      <Grid
        item
        xs={12}
        sm={6}
        className={`${classes.Grid} ${globalStyles.centerItems}`}
      >
        <DefaultDayPicker
          minDate={new Date()}
          date={requestedDate}
          onChange={onDayPickerChange}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        {appointmentList.length > 0 ? (
          <UpcomingAppointmentList
            appointmentList={appointmentList}
            onCancelAppointment={onCancelAppointment}
            moreButton={
              displayShowMore && (
                <ListItem
                  className={
                    appointmentList.length % 2
                      ? `${classes.ListItem} ${globalStyles.listEven}`
                      : `${classes.ListItem} ${globalStyles.listOdd}`
                  }
                >
                  <MoreButton
                    onClick={() =>
                      getAppointmentList({
                        token,
                        limit,
                        offset: nextIndex,
                        date: requestedDate,
                      })
                    }
                  />
                </ListItem>
              )
            }
          />
        ) : (
          <Typography align="center">No upcoming appointments</Typography>
        )}

        {/*displayShowMore && (
          <MoreButton
            onClick={() =>
              getAppointmentList({
                token,
                limit,
                offset: nextIndex,
                date: requestedDate,
              })
            }
          />
          )*/}
      </Grid>
    </Grid>
  );
};

export default UpcomingAppointments;
