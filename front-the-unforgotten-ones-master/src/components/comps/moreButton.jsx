import React from 'react';
import { makeStyles } from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import SmallClearButton from './smlClearButton';

const useStyles = makeStyles((theme) => ({
  button: {
    paddingLeft: '24px',
    paddingRight: '24px',
    '&:hover': {
      backgroundColor: '#faeb3e',
    },
  },
}));

function MoreButton(props) {
  const classes = useStyles();

  if (props.width != null) {
    return (
      <SmallClearButton
        endIcon={<KeyboardArrowDownIcon />}
        contents="Show More"
        width={props.width}
        {...props}
      />
    );
  } else {
    return (
      <SmallClearButton
        fullWidth
        endIcon={<KeyboardArrowDownIcon />}
        className={classes.button}
        contents="Show More"
        {...props}
      />
    );
  }
}
export default MoreButton;
