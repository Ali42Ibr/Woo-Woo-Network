import React, { useState } from 'react';
import * as yup from 'yup';
import { useHistory } from 'react-router-dom';
import {
  Grid,
  Paper,
  CssBaseline,
  makeStyles,
  Avatar,
} from '@material-ui/core';
//can change this icon later on to our logo
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { Formik } from 'formik';
import PageTitle from './comps/pgTitle';
import Copyright from './copyright';
import SmallTextField from './comps/smlTextField';
import DefaultButton from './comps/defButton';
import globalStyles from './comps/globalStyling.module.css';

/** This is the Yup schema for email credentials - it verifies if the format is valid for the email entered */
const schema = yup.object({
  email: yup
    .string()
    .email('Invalid email')
    .required('Please enter an email address'),
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
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0),
  },
}));

/** This is a separated component for the copyright of the website */
/*function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      { This will be changed to our website link }
      <Link color="inherit" href="https://material-ui.com/">
        The Woo Woo Net
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}*/

/** This is the Form - only the form */
const ForgotPasswordForm = (props) => {
  const classes = useStyles();
  const {
    values: { email },
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
      <Grid container spacing={1}>
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
          <DefaultButton
            type="submit"
            // Button will be disabled if anything is wrong
            disabled={!isValid}
            fullWidth
            className={classes.submit}
            //   THIS IS JUST FOR TESTING WILL DELETE LATER
            href="/email-sent"
            contents="Verify Email"
          />
        </Grid>
      </Grid>
    </form>
  );
};

/** This is the component for the page as a whole, the API calls are here */
function ForgotPasswordPage() {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const history = useHistory(); // let's us get sent to another page or somethin

  if (loading) {
    return <h4>Verifying...</h4>;
  }

  return (
    <div>
      <Paper className={`${classes.Paper} ${globalStyles.smlPgContainer}`}>
        <CssBaseline />
        <div className={`${classes.div} ${globalStyles.centerItems}`}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <PageTitle contents="Verify Your Email" />
          <Formik
            render={(props) => <ForgotPasswordForm {...props} />}
            validationSchema={schema}
            initialValues={{ email: '' }}
            // THIS PART TAKES CARE OF SENDING THE EMAIL TO THE USER
            // SO THE USER CAN RESET THEIR PASSWORD
            // THE API HANDLES THIS

            // onSubmit={(data, { setSubmitting }) => {
            //   //setSubmitting keeps track of whether you are in the midst of submitting data
            //   setLoading(true);
            //   (async () => {
            //     try {
            //       const response = await fetch(
            //         process.env.REACT_APP_API_DOMAIN + '/reset-password',
            //         {
            //           method: 'POST',
            //           headers: {
            //             'Content-Type': 'application/json;charset=utf-8',
            //           },
            //           body: JSON.stringify(data),
            //         }
            //       );

            //       history.push('/email-sent'); // sends you to the verify email page after you send your email.
            //       //it will check if email is in database - if it is - email is sent to user
            //     } catch (error) {
            //       console.log('Fetch API error - post' + error);
            //     }
            //   })();
            //   setLoading(false);
            //   setSubmitting(false);
            // }}
          />
        </div>
      </Paper>
      <Copyright />
    </div>
  );
}
export default ForgotPasswordPage;
