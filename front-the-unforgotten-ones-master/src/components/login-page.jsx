import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import * as yup from 'yup';
//can change this icon later on to our logo
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { Formik } from 'formik';
import {
  Avatar,
  Grid,
  Paper,
  Typography,
  Link,
  CssBaseline,
  Box,
  makeStyles,
} from '@material-ui/core';
import SmallTextField from './comps/smlTextField';
import DefaultButton from './comps/defButton';
import PageTitle from './comps/pgTitle';
import Copyright from './copyright';
import globalStyles from './comps/globalStyling.module.css';

// /** This is the Yup schema for login credentials - it verifies if format is valid for email and password requirements */
const schema = yup.object({
  email: yup
    .string()
    .email('Invalid email')
    .required('Please enter an email address'),
  password: yup.string().required('A password is required'),
});

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
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(2),
  },
}));

/** This is the Login Form - only the form */
const LoginForm = (props) => {
  const classes = useStyles();
  const {
    values: { email, password },
    errors,
    touched,
    handleSubmit,
    handleChange,
    isValid,
    setFieldTouched,
  } = props;

  const change = (name, e) => {
    e.persist();
    handleChange(e);
    setFieldTouched(name, true, false);
  };

  return (
    <form className={classes.form} onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <SmallTextField
            id="email"
            label="Email"
            type="email"
            name="email"
            autoComplete="email"
            autoFocus
            required
            fullWidth
            value={email}
            helperText={touched.email ? errors.email : ''}
            error={touched.email && Boolean(errors.email)}
            onChange={change.bind(null, 'email')}
            // onChange={(e) => setEmail(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <SmallTextField
            label="Password"
            type="password"
            name="password"
            id="password"
            autoComplete="current-password"
            required
            fullWidth
            value={password}
            helperText={touched.password ? errors.password : ''}
            error={touched.password && Boolean(errors.password)}
            // onChange={(e) => setPassword(e.target.value)}
            onChange={change.bind(null, 'password')}
          />
        </Grid>
        <Grid item xs={12}>
          <DefaultButton
            type="submit"
            fullWidth
            // Button will be disabled if anything is wrong
            disabled={!isValid}
            style={{ margin: '24px 0 24px 0' }}
            contents="Sign In"
          />
        </Grid>
      </Grid>
      <Grid container spacing={1}>
        <Grid item xs>
          <Link href="/forgot-password" variant="body2">
            Forgot password?
          </Link>
        </Grid>
        <Grid item>
          <Link href="/signup" variant="body2">
            {"Don't have an account? Sign Up"}
          </Link>
        </Grid>
      </Grid>
    </form>
  );
};

/** This is the component for the login page as a whole */
function LoginPage() {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // only here just in case
  const history = useHistory(); // let's us get sent to another page or somethin

  if (loading) {
    return <h4>Logging in...</h4>;
  }

  return (
    <div>
      <Paper className={`${classes.Paper} ${globalStyles.smlPgContainer}`}>
        <CssBaseline />
        <div className={`${globalStyles.centerItems}`}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <PageTitle contents="Sign In" />
          <Formik
            render={(props) => <LoginForm {...props} />}
            validationSchema={schema}
            initialValues={{ email: '', password: '' }}
            onSubmit={(data, { setSubmitting }) => {
              //setSubmitting keeps track of whether you are in the midst of submitting data
              setSubmitting(true);
              setLoading(true);
              (async () => {
                try {
                  await fetch(
                    process.env.REACT_APP_API_DOMAIN + '/auth/login',
                    {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify(data),
                    }
                  )
                    .then(function (response) {
                      return response.json();
                    })
                    .then(function (response) {
                      //CHECK
                      if (response.token) {
                        sessionStorage.setItem('token', response.token); // saves the token to session storage. I'm told this is unsafe.
                        history.push('/'); // go back to home page
                        window.location.reload(); // reload's the whole page after, since I don't know how to make the app switch from NoAuthSite to AuthSite gracefully and this works, if ungracefully.
                        setIsLoggedIn(true);
                      } else {
                        alert('Error: Username or password is incorrect');
                      }
                    });
                } catch (error) {
                  console.log('Fetch API error - post' + error);
                }
              })();
              setLoading(false);
              setSubmitting(false);
            }}
          ></Formik>
        </div>
      </Paper>
      <Copyright />
    </div>
  );
}
export default LoginPage;
