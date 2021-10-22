import React, { useState } from 'react';
//import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import * as yup from 'yup';
import { useHistory } from 'react-router-dom';
import { Formik } from 'formik';
import {
  Grid,
  Paper,
  Button,
  Box,
  Link,
  Checkbox,
  CssBaseline,
  FormControlLabel,
  makeStyles,
} from '@material-ui/core';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import SmallTextField from './comps/smlTextField';
import Copyright from './copyright.jsx';
import PageTitle from './comps/pgTitle';
import globalStyles from './comps/globalStyling.module.css';

const schema = yup.object({
  // Schema says what's allowed in the forms and what's not.
  firstName: yup
    .string()
    .trim()
    .min(2, 'Your name must be at least 2 characters!')
    .max(20, 'Your name cannot be more than 20 characters.')
    .matches(
      /^[a-zA-Z]+$/,
      'Invalid name. Use Upper or Lowercase letters only.'
    )
    .required('Your first name is required'),
  lastName: yup
    .string()
    .trim()
    .min(2, 'Your name must be at least 2 characters!')
    .max(20, 'Your name cannot be more than 20 characters.')
    .matches(
      /^[a-zA-Z]+$/,
      'Invalid name. Use Upper or Lowercase letters only.'
    )
    .required('Your last name is required'),
  email: yup.string().email().required('Please enter an email address'),
  password: yup
    .string()
    .min(6, 'Your password must be at least 6 characters')
    .required('A password is required'),
  passwordConfirm: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
});

/** This is the theme for the items on this page - nav bar not included - STYLING here! */
const useStyles = makeStyles((theme) => ({
  center: {
    display: 'flex',
    alignItems: 'center',
    height: '135vh',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },

  form: {
    width: '100%',
  },
}));

const SignUpForm = (props) => {
  const classes = useStyles();

  const {
    values: { email, password, firstName, lastName, isHealer, passwordConfirm },
    errors,
    touched,
    handleChange,
    handleSubmit,
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
        <Grid item xs={12} sm={6}>
          <SmallTextField
            id="firstName"
            label="First Name"
            autoComplete="fname"
            autoFocus
            required
            fullWidth
            value={firstName}
            helperText={touched.firstName ? errors.firstName : ''}
            error={touched.firstName && Boolean(errors.firstName)}
            // onChange={(e) => setFirstName(e.target.value)}
            onChange={change.bind(null, 'firstName')}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <SmallTextField
            id="lastName"
            label="Last Name"
            autoComplete="lname"
            required
            fullWidth
            value={lastName}
            helperText={touched.lastName ? errors.lastName : ''}
            error={touched.lastName && Boolean(errors.lastName)}
            onChange={change.bind(null, 'lastName')}
            // onChange={(e) => setLastName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} margintop="8px" marginbottom="8px">
          <SmallTextField
            id="email"
            label="Email"
            type="email"
            name="email"
            autoComplete="email"
            required
            fullWidth
            value={email}
            helperText={touched.email ? errors.email : ''}
            error={touched.email && Boolean(errors.email)}
            onChange={change.bind(null, 'email')}
            // onChange={(e) => setEmail(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} paddingbottom="0">
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
            onChange={change.bind(null, 'password')}
            // onChange={(e) => setPassword(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} paddingtop="0">
          <SmallTextField
            label="Confirm Password"
            type="password"
            name="passwordConfirm"
            id="passwordConfirm"
            autoComplete="current-password-confirm"
            required
            fullWidth
            value={passwordConfirm}
            helperText={touched.passwordConfirm ? errors.passwordConfirm : ''}
            error={touched.passwordConfirm && Boolean(errors.passwordConfirm)}
            onChange={change.bind(null, 'passwordConfirm')}
            // onChange={(e) => setPassword(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} paddingleft="24px">
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                icon={<FavoriteBorder />}
                name="isHealer"
                checked={isHealer}
                onChange={change.bind(null, 'isHealer')}
                value={isHealer}
              />
            }
            label="Are you a healer?"
          />
        </Grid>
      </Grid>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        className={classes.submit}
        // Button will be disabled if anything is wrong
        disabled={!isValid}
      >
        Sign Up
      </Button>
      <Grid container justify="flex-end">
        <Grid item>
          <Link href="/login" variant="body2">
            Already have an account? Sign in
          </Link>
        </Grid>
      </Grid>
    </form>
  );
};

/*  This page is the one that renders when you press "Create Account" in the header. It's mostly just a big form.
Note: This doesn't log you in after you create the account. maybe that should be added?
*/
function SignUp() {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const history = useHistory(); // let's us get sent to another page or somethin

  if (loading) {
    return <h4>Signing up...</h4>;
  }

  return (
    <div>
      <Paper className={`${classes.Paper} ${globalStyles.smlPgContainer}`}>
        <CssBaseline />
        <div className={`${classes.div} ${globalStyles.centerItems}`}>
          {/*<Avatar className={classes.avatar}>
            <LockOutlinedIcon />
  </Avatar>*/}
          <Box className={`${classes.Box} ${globalStyles.centerItems}`}>
            <PageTitle contents="Sign Up" />
          </Box>
          <Formik
            render={(props) => <SignUpForm {...props} />}
            validationSchema={schema}
            initialValues={{
              email: '',
              password: '',
              firstName: '',
              lastName: '',
              // description: "",
              // brand: "",
              //isHealer: false,
              //passwordConfirm: '',
            }}
            onSubmit={(data, { setSubmitting }) => {
              //setSubmitting keeps track of whether you are in the midst of submitting data
              setSubmitting(true);
              setLoading(true);
              (async () => {
                try {
                  const response = await fetch(
                    process.env.REACT_APP_API_DOMAIN + '/users',
                    {
                      method: 'POST',
                      mode: 'cors',
                      headers: {
                        'Content-Type': 'application/json;charset=utf-8',
                      },
                      body: JSON.stringify(data),
                    }
                  );
                  if (response.status == 201) {
                    history.push('/login'); // sends you to the login page after you make the account
                  } else {
                    alert('Email already exists.');
                  }
                  //maybe I should make it test to see if the account actually gets made but... no time!
                } catch (error) {
                  console.log('Fetch API error - post' + error);
                }
              })();
              setLoading(false);
              setSubmitting(false);
            }}
          />
        </div>
      </Paper>
      <Copyright />
    </div>
  );
}
export default SignUp;
