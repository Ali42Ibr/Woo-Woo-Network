import React, { useState } from 'react';
import './app/app.css';
import {
  makeStyles,
  List,
  ListItem,
  Grid,
  Typography,
} from '@material-ui/core';
import SmallButton from './comps/smlButton';
import globalStyles from './comps/globalStyling.module.css';
import moment from 'moment-timezone';
import AlertDialog from './comps/alert-dialog';
import uniqid from 'uniqid';

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
  appointmentItemChildContainer: {
    width: '50%',
  },
  appointmentItemContainer: {
    position: 'relative',
  },
  button: {
    paddingLeft: '24px',
    paddingRight: '24px',
    '&:hover': {
      backgroundColor: '#CEFA3E',
    },
  },
  activeBackground: {
    backgroundColor: '#CEFA3E !important',
  },
}));

const UpcomingAppointmentList = ({
  appointmentList,
  onCancelAppointment,
  moreButton,
}) => {
  return (
    <List className={`${globalStyles.list}`}>
      {appointmentList.map((appointment, index) => (
        <AppointmentItem
          index={index}
          key={appointment.id}
          appointment={appointment}
          onCancelAppointment={onCancelAppointment}
        />
      ))}
      {moreButton}
    </List>
  );
};

const AppointmentItem = ({ appointment, index, onCancelAppointment }) => {
  const classes = useStyles();
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    // need to check if other items are active
    setIsActive(!isActive);
  };

  const getClassName = () => {
    let className = classes.appointmentItemContainer + ' ';
    className +=
      index % 2 ? `${globalStyles.listEven}` : `${globalStyles.listOdd}`;
    if (isActive) {
      className += ` ${classes.activeBackground}`;
    }
    return className;
  };

  return (
    <ListItem className={getClassName()}>
      <Grid container spacing={1}>
        <Grid item xs={6} onClick={handleClick}>
          <Typography variant="body1">{`${moment
            .tz(appointment.sessionTime, moment.tz.guess())
            .format('MMMM Do @ hh:mm a')}`}</Typography>
        </Grid>
        <Grid item xs={6} onClick={handleClick}>
          <Typography align="right" variant="body1">
            {appointment.name}
          </Typography>
        </Grid>
        {isActive && (
          <AppointmentItemDetail
            {...appointment}
            handleClick={handleClick}
            onCancelAppointment={onCancelAppointment}
          />
        )}
      </Grid>
    </ListItem>
  );
};

const AppointmentItemDetail = ({
  serviceName,
  sessionLength,
  cleanUpTime,
  price,
  isClient,
  id,
  onCancelAppointment,
  healerProfileId,
  handleClick,
}) => {
  return (
    <>
      <Grid item xs={6} onClick={handleClick}>
        <Typography variant="body1">{serviceName} service</Typography>
      </Grid>
      <Grid item xs={6} onClick={handleClick}>
        <Typography align="right" variant="body1">
          {sessionLength} minutes
        </Typography>
      </Grid>
      <Grid item xs={6}>
        {' '}
        onClick={handleClick}
        <Typography variant="body1">
          Join as {isClient ? 'client' : 'healer'}
        </Typography>
      </Grid>
      <Grid item xs={6} onClick={handleClick}>
        <Typography align="right" variant="body1">
          {price} CAD
        </Typography>
      </Grid>
      <AppointmentItemOption
        isClient={isClient}
        appointmentId={id}
        onCancelAppointment={onCancelAppointment}
        healerId={healerProfileId}
        time={sessionLength + cleanUpTime}
      />
    </>
  );
};
const AppointmentItemOption = ({
  isClient,
  appointmentId,
  onCancelAppointment,
  healerId,
  time,
}) => {
  if (isClient) {
    return (
      <ClientOptionButton
        appointmentId={appointmentId}
        onCancelAppointment={onCancelAppointment}
        healerId={healerId}
        time={time}
      />
    );
  } else {
    return (
      <HealerOptionButton
        appointmentId={appointmentId}
        healerId={healerId}
        time={time}
      />
    );
  }
};

const ClientOptionButton = ({
  appointmentId,
  onCancelAppointment,
  healerId,
  time,
}) => {
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const onCancelClick = () => {
    setIsOpenDialog(true);
  };

  const cancelAppointment = async () => {
    try {
      const token = sessionStorage.getItem('token');
      // cancel appointment
      //  need to handle error code
      const response = await fetch(
        process.env.REACT_APP_API_DOMAIN +
          `/appointments/${appointmentId}/cancel`,
        {
          method: 'GET',
          mode: 'cors',
          headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json;charset=utf-8',
          },
        }
      );
      if (response.status >= 400) {
        alert('Bad request. Can not cancel appointment. Please try again.');
      } else {
        alert('the appointment has been cancel');
        onCancelAppointment();
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onDialogConfirm = () => {
    // send request to server
    cancelAppointment();
    setIsOpenDialog(false);
  };
  const onDialogCancel = () => {
    setIsOpenDialog(false);
  };
  return (
    <>
      <Grid item xs={6}>
        <SmallButton
          href={`/reschedule?appointmentId=${appointmentId}&healer=${healerId}&time=${time}`}
          contents="Reschedule"
          style={{ width: '100%', margin: '0' }}
        />
      </Grid>
      <Grid item xs={6}>
        <SmallButton
          onClick={onCancelClick}
          contents="Cancel"
          style={{ width: '100%', margin: '0' }}
        />
      </Grid>
      <Grid item xs={6}>
        <AlertDialog
          key={uniqid()}
          isOpen={isOpenDialog}
          message="You may be charged by cancel the appointment"
          title="Confirm cancel appointment"
          confirm={onDialogConfirm}
          cancel={onDialogCancel}
        />
      </Grid>
    </>
  );
};

const HealerOptionButton = ({ appointmentId, healerId, time }) => {
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const onCancelClick = () => {
    console.log('click here');
    setIsOpenDialog(true);
  };

  const cancelAppointment = async () => {
    try {
      const token = sessionStorage.getItem('token');
      // cancel appointment
      //  need to handle error code
      const response = await fetch(
        process.env.REACT_APP_API_DOMAIN +
          `/appointments/${appointmentId}/request/cancel`,
        {
          method: 'GET',
          mode: 'cors',
          headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json;charset=utf-8',
          },
        }
      );
      if (response.status >= 400) {
        alert('Can not make the request. Please try again.');
      } else {
        alert('the appointment has been cancel');
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onDialogConfirm = () => {
    // send request to server
    cancelAppointment();
    setIsOpenDialog(false);
  };
  const onDialogCancel = () => {
    setIsOpenDialog(false);
  };
  return (
    <>
      <Grid item xs={12} sm={6}>
        <SmallButton
          href={`/reschedule?appointmentId=${appointmentId}&healerRequest=true&healer=${healerId}&time=${time}`}
          contents="Reschedule Request"
          style={{ width: '100%', margin: '0' }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <SmallButton
          onClick={onCancelClick}
          contents="Cancel Request"
          style={{ width: '100%', margin: '0' }}
        />
      </Grid>
      <Grid item xs={12}>
        <AlertDialog
          key={uniqid()}
          isOpen={isOpenDialog}
          message="Do you want to request client cancel this appointment?"
          title="Confirm request cancel appointment"
          confirm={onDialogConfirm}
          cancel={onDialogCancel}
        />
      </Grid>
    </>
  );
};

export default UpcomingAppointmentList;
