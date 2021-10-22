import React, { useState } from 'react';
//can change this icon later on to our logo
import { Paper, Box, Typography, makeStyles } from '@material-ui/core';

import { Button } from '@material-ui/core';

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

const TimeButton = (props) => {
  const classes = useStyles();

  return (
    <Button
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

const TimeSelector = ({ availableTimes, setSlot }) => {
  const classes = useStyles();

  return (
    <Box className={classes.timeContainer}>
      {availableTimes.map((time, index) => {
        return (
          <TimeSelector_Day
            index={index}
            key={time.date}
            slots={time.availableSlots}
            setSlot={setSlot}
          />
        );
      })}
    </Box>
  );
};

const TimeSelector_Day = (props) => {
  const classes = useStyles();
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const onClickHandler = (index) => {
    props.setSlot({
      index: props.index,
      slot: props.slots[index],
    });
  };

  return (
    <Paper
      square
      className={props.index % 2 ? classes.slotEven : classes.slotOdd}
    >
      <Typography variant="h6" className={classes.weekText}>
        {daysOfWeek[props.index]}
      </Typography>
      {props.slots.map((time, index) => {
        return (
          <TimeButton
            key={index}
            time={time}
            index={index}
            onClick={() => onClickHandler(index)}
          />
        );
      })}
    </Paper>
  );
};

export default TimeSelector;
