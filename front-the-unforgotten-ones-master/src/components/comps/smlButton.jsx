import React from 'react';
import { makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: '12px 16px 12px 16px',
    paddingLeft: '24px',
    paddingRight: '24px',
    '&:hover': {
      backgroundColor: '#faeb3e',
    },
  },
}));

function SmallButton(props) {
  const classes = useStyles();

  return (
    <Button
      variant="contained"
      size="small"
      color="primary"
      className={classes.button}
      {...props}
    >
      {props.contents}
    </Button>
  );
}
export default SmallButton;
