import React from 'react';
import {
  Typography,
  Link,
  Paper,
  Button,
  Grid,
  makeStyles,
} from '@material-ui/core';
import SmallClearButton from './comps/smlClearButton';
import globalStyles from './comps/globalStyling.module.css';

const useStyles = makeStyles((theme) => ({
  text: {
    color: '#80994d',
    margin: theme.spacing(0, 2),
  },
  background: {
    backgroundColor: theme.palette.logo.green,
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

/** This is a separated component for the copyright of the website */
function Copyright() {
  const classes = useStyles();

  return (
    <div className={`${globalStyles.footer}`}>
      <Paper className={classes.background} square>
        <Typography variant="body2" className={classes.text}>
          {/* This will be a link to our About us page */}
          <Link color="inherit" href="/about-us">
            About Us
          </Link>
        </Typography>
        <Typography variant="body2" className={classes.text}>
          {'Copyright © '}
          {/* This will be changed to our website link */}
          <Link color="inherit" href="https://woo-woo.net/">
            The Woo Woo Net
          </Link>{' '}
          {new Date().getFullYear()}
          {'.'}
        </Typography>
        <Typography variant="body2" className={classes.text}>
          {/* This will be a link to our privacy policy */}
          <Link color="inherit" href="/privacy-policy">
            Privacy Policy
          </Link>
        </Typography>
      </Paper>
    </div>
  );
}
export default Copyright;
