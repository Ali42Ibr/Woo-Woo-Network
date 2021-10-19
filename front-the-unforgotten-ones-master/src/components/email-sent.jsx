import * as yup from 'yup';
import React, { useState } from 'react';
import {
  Paper,
  Avatar,
  CssBaseline,
  Box,
  Container,
  Link,
  Typography,
  Button,
  TextField,
  makeStyles,
} from '@material-ui/core';
//can change this icon later on to our logo
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

/** This is the theme for the items on this page - nav bar not included - STYLING here! */
const useStyles = makeStyles((theme) => ({
  center: {
    display: 'flex',
    alignItems: 'center',
    height: '110vh',
  },
  root: {
    backgroundColor: theme.palette.secondary.main,
    padding: theme.spacing(4, 3),
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.25)',
    borderRadius: '10px',
  },
  paper: {
    marginTop: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

/** This is a separated component for the copyright of the website */
function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      {/* This will be changed to our website link */}
      <Link color="inherit" href="https://material-ui.com/">
        The Woo Woo Net
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

/** This is the component for the email sent info page */
const EmailSentPage = () => {
  const classes = useStyles();

  return (
    <div>
      <Paper>
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography
            component="h1"
            variant="h2"
            align="center"
            color="textPrimary"
            gutterBottom
          >
            Email Sent
          </Typography>
          <Typography
            variant="h5"
            align="center"
            color="textSecondary"
            component="p"
          >
            An email has been sent with recovery details to the email provided.
            Follow the directions in the email to reset your password.
          </Typography>
          <div>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              className={classes.submit}
              href="/login"
            >
              Sign In
            </Button>
          </div>
        </div>
      </Paper>
      <Copyright />
    </div>
  );
};
export default EmailSentPage;
