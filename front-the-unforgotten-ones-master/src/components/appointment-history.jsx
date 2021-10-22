import React, { useState, useEffect } from 'react';
import Copyright from './copyright.jsx';
import {
  Grid,
  Paper,
  Typography,
  Box,
  CssBaseline,
  makeStyles,
  List,
  ListItem,
} from '@material-ui/core';
import SmallButton from './comps/smlButton';
import globalStyles from './comps/globalStyling.module.css';
import MoreButton from './comps/moreButton';
import PageTitle from './comps/pgTitle.jsx';
import moment from 'moment-timezone';
//import moment from 'moment';
import 'moment-timezone';

const useStyles = makeStyles((theme) => ({
  appointmentItem: {
    cursor: 'pointer',
  },
}));

const History = () => {
  const classes = useStyles();
  const [appointmentList, setAppointmentList] = useState([]);
  const [nextIndex, setNextIndex] = useState(0); // last index need to be from 0
  const [displayShowMore, setDisplayShowMore] = useState(true);
  const limit = 5;
  const token = sessionStorage.getItem('token');

  const getAppointmentList = async ({ token, limit, offset }) => {
    try {
      const params = {
        limit,
        offset,
      };
      const queryParams = new URLSearchParams(params);
      const response = await fetch(
        process.env.REACT_APP_API_DOMAIN +
          '/appointments/history?' +
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

  useEffect(() => {
    getAppointmentList({
      token,
      limit,
      offset: nextIndex,
    });
  }, []);
  return (
    <List className={`${classes.List} ${globalStyles.list}`}>
      {appointmentList.map((appointment, index) => {
        return (
          <AppointmentItem
            key={appointment.id}
            appointment={appointment}
            index={index}
          />
        );
      })}
      {displayShowMore && (
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
              })
            }
          />
        </ListItem>
      )}
    </List>
  );
};

const AppointmentItem = ({ appointment, index }) => {
  const classes = useStyles();
  const [isActive, setIsActive] = useState(false);
  const handleClick = () => {
    // need to check if other items are active
    setIsActive(!isActive);
  };

  const getClassName = () => {
    let className = ' ';
    if (isActive) {
      className += `${classes.ListItem} ${globalStyles.listSelected}`;
    } else {
      className +=
        index % 2 ? `${globalStyles.listEven}` : `${globalStyles.listOdd}`;
    }
    return className;
  };

  return (
    <ListItem className={getClassName()}>
      <Grid container spacing={1} onClick={handleClick}>
        <Grid item xs={6}>
          <Typography variant="body1">
            {moment
              .tz(appointment.sessionTime, moment.tz.guess())
              .format('MMMM Do @ hh:mm a')}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography align="right" variant="body1">
            {appointment.name}
          </Typography>
        </Grid>
        {isActive && (
          <>
            <Grid item xs={6}>
              <Typography variant="body1">
                {appointment.serviceName} service
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography align="right" variant="body1">
                {appointment.sessionLength} minutes
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">
                Join as {appointment.isClient ? 'client' : 'healer'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography align="right" variant="body1">
                {appointment.price} CAD
              </Typography>
            </Grid>
            {appointment.isClient && (
              <ReviewButton
                review={appointment.review}
                appointmentId={appointment.id}
              />
            )}
          </>
        )}
      </Grid>
    </ListItem>
  );
};

const ReviewButton = ({ review, appointmentId }) => {
  return (
    <Grid item xs={12}>
      <Box display="flex">
        {review ? (
          // <SmallButton
          //   type="submit"
          //   contents="Edit Review"
          //   fullWidth
          //   href={`/review/${review.id}`}
          // />
          <></>
        ) : (
          <SmallButton
            type="submit"
            contents="Leave Review"
            fullWidth
            href={`/review/?appointmentId=${appointmentId}`}
          />
        )}
      </Box>
    </Grid>
  );
};

const AppointmentHistory = () => {
  const classes = useStyles();

  return (
    <div>
      <Paper className={`${classes.Paper} ${globalStyles.smlPgContainer}`}>
        <CssBaseline />
        <Box className={`${classes.Box} ${globalStyles.centerItems}`}>
          <PageTitle contents="Appointment History" />
        </Box>
        <History />
      </Paper>
      <Copyright />
    </div>
  );
};
export default AppointmentHistory;
