import React from 'react';
import { makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  button: {
    paddingLeft: '24px',
    paddingRight: '24px',
    '&:hover': {
      backgroundColor: '#faeb3e',
    },
  },
}));

function SmallClearButton(props) {
  const classes = useStyles();

  return (
    <Button size="small" className={classes.button} {...props}>
      {props.contents}
    </Button>
  );
}
export default SmallClearButton;
