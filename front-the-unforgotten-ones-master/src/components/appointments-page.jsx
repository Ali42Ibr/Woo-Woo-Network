/**  
 
*/
import React, { useState } from 'react';
import Copyright from './copyright.jsx';
import AddIcon from '@material-ui/icons/Add';
import {
  Grid,
  Paper,
  Typography,
  Box,
  CssBaseline,
  makeStyles,
  List,
  ListItem,
  Button,
} from '@material-ui/core';
import SmallButton from './comps/smlButton';
import SmallClearButton from './comps/smlClearButton.jsx';
import DefaultButton from './comps/defButton.jsx';
import DefaultDayPicker from './comps/defDayPicker.jsx';
import PageTitle from './comps/pgTitle.jsx';
import SmallTextField from './comps/smlTextField.jsx';
import MoreButton from './comps/moreButton.jsx';
import Rating from '@material-ui/lab/Rating';
import PropTypes from 'prop-types';
import globalStyles from './comps/globalStyling.module.css';

const useStyles = makeStyles((theme) => ({
  reviewButton: {
    borderRadius: '16px',
    margin: '4px',
    color: '#ffffff',
    '&:hover': {
      backgroundColor: '#faeb3e',
      color: '#000000',
    },
  },
  reviewButton_Selected: {
    borderRadius: '16px',
    margin: '4px',
    backgroundColor: '#b1eb3b',
    color: '#ffffff',
    '&:hover': {
      backgroundColor: '#faeb3e',
      color: '#000000',
    },
  },
  reviewInfo: {
    width: '100%',
    padding: '8px',
    backgroundColor: theme.palette.background.orange,
    marginBottom: theme.spacing(2),
  },
}));

const AppointmentList = (props) => {
  const classes = useStyles();

  return (
    <List className={`${classes.List} ${globalStyles.list}`}>
      <ServiceListItem
        index={0}
        isHealer={props.isHealer}
        appointmentDate="May 13th"
        appointmentTime="9:30"
        appointmentName="Ryan Heal"
        selected="true"
      />
      <ServiceListItem
        index={1}
        isHealer={props.isHealer}
        appointmentDate="May 13th"
        appointmentTime="11:00"
        appointmentName="John Smith"
      />
      <ServiceListItem
        index={2}
        isHealer={props.isHealer}
        appointmentDate="May 15th"
        appointmentTime="9:30"
        appointmentName="Tommy Smith"
      />
      <ListItem
        className={
          3 % 2
            ? `${classes.ListItem} ${globalStyles.listEven}`
            : `${classes.ListItem} ${globalStyles.listOdd}`
        }
      >
        <MoreButton />
      </ListItem>
    </List>
  );
};

const ServiceListItem = (props) => {
  const classes = useStyles();

  if (props.selected) {
    return (
      <ListItem className={`${classes.ListItem} ${globalStyles.listSelected}`}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body1">
              {props.appointmentDate} @ {props.appointmentTime}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography align="right" variant="body1">
              {props.appointmentName}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <SmallButton
              fullWidth
              contents={props.isHealer ? 'Reschedule Request' : 'Reschedule'}
              style={{ margin: '0' }}
            />
          </Grid>
          <Grid item xs={6}>
            <SmallButton
              fullWidth
              contents={props.isHealer ? 'Cancelation Request' : 'Cancel'}
              style={{ margin: '0' }}
            />
          </Grid>
        </Grid>
      </ListItem>
    );
  } else {
    return (
      <ListItem
        className={
          props.index % 2
            ? `${classes.ListItem} ${globalStyles.listEven}`
            : `${classes.ListItem} ${globalStyles.listOdd}`
        }
      >
        <Grid container spacing={0}>
          <Grid item xs={6}>
            <Typography variant="body1">
              {props.appointmentDate} @ {props.appointmentTime}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography align="right" variant="body1">
              {props.appointmentName}
            </Typography>
          </Grid>
        </Grid>
      </ListItem>
    );
  }
};

const AppointmentsPage = (props) => {
  const classes = props;
  const isHealer = true;

  return (
    <div>
      <Paper className={`${classes.Paper} ${globalStyles.defPgContainer}`}>
        <CssBaseline />
        {isHealer ? (
          <Box className={`${classes.Box} ${globalStyles.pgNavBar}`}>
            <SmallClearButton
              type="submit"
              href="/#"
              contents="Manage Appointments"
              variant="outlined"
              color="primary"
            />
            <SmallClearButton
              type="submit"
              href="/schedule"
              contents="Manage Schedule"
            />
          </Box>
        ) : (
          <PageTitle align="center" contents="Manage Appointments" />
        )}
        <Grid container>
          <Grid item xs={12} sm={6}>
            <DefaultDayPicker />
          </Grid>
          <Grid item xs={12} sm={6}>
            <AppointmentList isHealer={isHealer} />
          </Grid>
        </Grid>
      </Paper>
      <Copyright />
    </div>
  );
};
AppointmentsPage.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default AppointmentsPage;
