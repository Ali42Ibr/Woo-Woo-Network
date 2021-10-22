import React from 'react';
import { makeStyles } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
  container: {
    width: '60%',
    '@media (max-width: 480px)': {
      width: '100%',
    },
    margin: 'auto',
    marginTop: '100px',
    marginBottom: '100px',
    backgroundColor: theme.palette.background.white,
    padding: theme.spacing(4, 3),
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.25)',
    borderRadius: '10px',
  },
}));

function LargePageContainer(props) {
  const classes = useStyles();

  return (
    <Paper className={classes.container} {...props}>
      {props.contents}
    </Paper>
  );
}
export default LargePageContainer;
