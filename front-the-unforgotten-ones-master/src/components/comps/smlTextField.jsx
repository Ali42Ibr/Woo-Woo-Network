import React from 'react';
import { makeStyles } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
  textField_full: {
    backgroundColor: '#ffffff',
    borderRadius: '4px',
  },
  textField_width: {
    backgroundColor: '#ffffff',
    borderRadius: '4px',
    width: '112px',
  },
}));

function SmallTextField(props) {
  const classes = useStyles();

  if (props.fullWidth) {
    return (
      <TextField
        variant="outlined"
        margin="dense"
        fullWidth
        className={classes.textField_full}
        {...props}
      />
    );
  } else {
    return (
      <TextField
        variant="outlined"
        margin="dense"
        className={classes.textField_width}
        {...props}
      />
    );
  }
}
export default SmallTextField;
