import React, { useState } from 'react';
import * as yup from 'yup';
import { useHistory } from 'react-router-dom';
import { Formik } from 'formik';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import jwt_decode from 'jwt-decode';
import Copyright from './copyright';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import {
  Avatar,
  Grid,
  Paper,
  Typography,
  Box,
  Link,
  CssBaseline,
  Container,
  Select,
  FormControl,
  FormHelperText,
  MenuItem,
  InputLabel,
  CheckBox,
  FormControlLabel,
  TextField,
  Button,
  makeStyles,
} from '@material-ui/core';
import SmallTextField from './comps/smlTextField';
import SaveButton from './comps/saveButton';
import SmallButton from './comps/smlButton';
import PageTitle from './comps/pgTitle';
import globalStyles from './comps/globalStyling.module.css';

const schemaHealerInfo = yup.object({
  // Schema says what's allowed in the forms and what's not.
  address: yup
    .string()
    .trim()
    .min(2, 'You must have a longer address')
    .max(1000, 'Your address cannot be more than 1000 characters.'),
  postalCode: yup
    .string()
    .trim()
    .min(6, 'Your postal code must contain at least 6 characters!')
    .max(7, 'Your postal code must follow the canadian format.')
    .matches(
      /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i,
      'Invalid postal code. Please follow the Canadian format .'
    )
    .required('Your Postal Code is required'),
  description: yup
    .string()
    .trim()
    .min(2, 'You must have a longer description')
    .max(1000, 'Your description cannot be more than 1000 characters.'),
  brandName: yup
    .string()
    .trim()
    .min(2, 'Please make this longer.')
    .max(1000, 'This field cannot contain more than 1000 characters.'),
});

const schemaEmail = yup.object({
  // Schema says what's allowed in the forms and what's not.
  email: yup.string().email().required('Please enter an email address'),
  password: yup.string().required('A password is required'),
});

const schemaPassword = yup.object({
  // Schema says what's allowed in the forms and what's not.
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword'), null], 'Passwords must match')
    .required('Please confirm your password'),
  newPassword: yup
    .string()
    .min(6, 'Your password must be at least 6 characters')
    .required('A new password is required'),
  oldPassword: yup.string().required('A password is required'),
});

const schemaName = yup.object({
  // Schema says what's allowed in the forms and what's not.
  firstName: yup
    .string()
    .trim()
    .min(2, 'Your name must be at least 2 characters!')
    .max(15, 'Your name cannot be more than 20 characters.')
    .matches(
      /^[A-Za-z]+$/,
      'Invalid name. Use Upper or Lowercase letters only.'
    )
    .required('Your first name is required'),
  lastName: yup
    .string()
    .trim()
    .min(2, 'Your name must be at least 2 characters!')
    .max(15, 'Your name cannot be more than 20 characters.')
    .matches(
      /^[A-Za-z]+$/,
      'Invalid name. Use Upper or Lowercase letters only.'
    )
    .required('Your last name is required'),
});

// styling for this page contents (not including nav bar)
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.secondary.main,
    padding: theme.spacing(4, 3),
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.25)',
    borderRadius: '10px',
    maxWidth: '500px',
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  input: {
    display: 'none',
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  link: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: theme.spacing(2),
  },
}));
/**  This page is the one that renders when you press "Create Account" in the header. It's mostly just a big form.
Note: This doesn't log you in after you create the account. maybe that should be added?
*/

const FullNameEditForm = (props) => {
  const classes = useStyles();

  const {
    values: { firstName, lastName },
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
      <Grid container spacing={1}>
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
        <SaveButton
          type="submit"
          fullWidth
          contents="Save Full Name"
          // Button will be disabled if anything is wrong
          disabled={!isValid}
        />
      </Grid>
    </form>
  );
};

const EmailEditForm = (props) => {
  const classes = useStyles();

  const {
    values: { email, password },
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
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <SmallTextField
            id="email"
            label="Email"
            autoComplete="email"
            required
            fullWidth
            value={email}
            helperText={touched.email ? errors.email : ''}
            error={touched.email && Boolean(errors.email)}
            onChange={change.bind(null, 'email')}
            // onChange={(e) => setLastName(e.target.value)}
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
            onChange={change.bind(null, 'password')}
            // onChange={(e) => setPassword(e.target.value)}
          />
        </Grid>
        <SaveButton
          type="submit"
          fullWidth
          contents="Save New Email"
          // Button will be disabled if anything is wrong
          disabled={!isValid}
        />
      </Grid>
    </form>
  );
};

const PasswordEditForm = (props) => {
  const classes = useStyles();

  const {
    values: { newPassword, confirmPassword, oldPassword },
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
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <SmallTextField
            id="newPassword"
            label="New Password"
            autoComplete="new-password"
            type="password"
            required
            fullWidth
            value={newPassword}
            helperText={touched.newPassword ? errors.newPassword : ''}
            error={touched.newPassword && Boolean(errors.newPassword)}
            onChange={change.bind(null, 'newPassword')}
          />
        </Grid>
        <Grid item xs={12}>
          <SmallTextField
            id="confirmPassword"
            label="Confirm Password"
            autoComplete="confirm-password"
            type="password"
            required
            fullWidth
            value={confirmPassword}
            helperText={touched.confirmPassword ? errors.confirmPassword : ''}
            error={touched.confirmPassword && Boolean(errors.confirmPassword)}
            onChange={change.bind(null, 'confirmPassword')}
          />
        </Grid>
        <Grid item xs={12}>
          <SmallTextField
            id="oldPassword"
            label="Old Password"
            autoComplete="old-password"
            type="password"
            required
            fullWidth
            value={oldPassword}
            helperText={touched.oldPassword ? errors.oldPassword : ''}
            error={touched.oldPassword && Boolean(errors.oldPassword)}
            onChange={change.bind(null, 'oldPassword')}
          />
        </Grid>
        <SaveButton
          type="submit"
          fullWidth
          contents="Save New Password"
          // Button will be disabled if anything is wrong
          disabled={!isValid}
        />
      </Grid>
    </form>
  );
};

const HealerInfoEditForm = (props) => {
  const classes = useStyles();

  const {
    values: { brandName, description, address, city, postalCode, province },
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
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <SmallTextField
            id="brandName"
            label="Brand Name"
            autoComplete="brand-name"
            required
            fullWidth
            value={brandName}
            helperText={touched.brandName ? errors.brandName : ''}
            error={touched.brandName && Boolean(errors.brandName)}
            onChange={change.bind(null, 'brandName')}
            // onChange={(e) => setLastName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <SmallTextField
            id="description"
            label="Description"
            multiline
            rows={4}
            autoComplete="description"
            required
            fullWidth
            value={description}
            helperText={touched.description ? errors.description : ''}
            error={touched.description && Boolean(errors.description)}
            onChange={change.bind(null, 'description')}
            // onChange={(e) => setLastName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <SmallTextField
            id="address"
            label="Address"
            autoComplete="location-address"
            required
            fullWidth
            value={address}
            helperText={touched.address ? errors.address : ''}
            error={touched.address && Boolean(errors.address)}
            onChange={change.bind(null, 'address')}
          />
        </Grid>
        <Grid item xs={12}>
          <SmallTextField
            id="city"
            label="City"
            autoComplete="location-city"
            required
            fullWidth
            value={city}
            helperText={touched.city ? errors.city : ''}
            error={touched.city && Boolean(errors.city)}
            onChange={change.bind(null, 'city')}
          />
        </Grid>
        <Grid item xs={12}>
          <SmallTextField
            id="province"
            label="Province"
            autoComplete="location-province"
            required
            fullWidth
            value={province}
            helperText={touched.province ? errors.province : ''}
            error={touched.province && Boolean(errors.province)}
            onChange={change.bind(null, 'province')}
          />
        </Grid>
        <Grid item xs={12}>
          <SmallTextField
            id="postalCode"
            label="Postal Code"
            inputProps={{ maxLength: 7 }}
            autoComplete="location-postal-code"
            required
            fullWidth
            value={postalCode}
            helperText={touched.postalCode ? errors.postalCode : ''}
            error={touched.postalCode && Boolean(errors.postalCode)}
            onChange={change.bind(null, 'postalCode')}
          />
        </Grid>
        <SaveButton
          type="submit"
          fullWidth
          contents="Save Information"
          // Button will be disabled if anything is wrong
          disabled={!isValid}
        />
      </Grid>
    </form>
  );
};

/**  This page is the one that renders when you press "Create Account" in the header. It's mostly just a big form.
Note: This doesn't log you in after you create the account. maybe that should be added?
*/
const AccountEdit = () => {
  const aToken = sessionStorage.getItem('token');
  const classes = useStyles();
  const history = useHistory(); // let's us get sent to another page or somethin

  const [userFirstName, setFirstName] = React.useState(String);
  const [userLastName, setLastName] = React.useState(String);
  const userid = jwt_decode(aToken).user_id;

  const [healerDesc, setDesc] = React.useState(String);
  const [healerBrand, setBrand] = React.useState(String);
  const [address, setAddress] = React.useState(String);
  const [city, setCity] = React.useState(String);
  const [province, setProvince] = React.useState(String);
  const [postalCode, setPostalCode] = React.useState(String);

  const [userEmail, setEmail] = React.useState(String);
  const [userImage, setUserImage] = React.useState();

  React.useEffect(() => {
    // This fills the form with your current user data.
    (async () => {
      try {
        const response = await fetch(
          process.env.REACT_APP_API_DOMAIN + '/users',
          {
            method: 'GET',
            headers: {
              Authorization: 'Bearer ' + aToken,
              'Content-Type': 'application/json',
            },
          }
        );
        if (!response.ok)
          throw Error(response.status + ': ' + response.statusText); // error checking, is the data okay?
        const data = await response.json(); // transform the data from string into JSON format.
        setFirstName(data.firstName);
        setLastName(data.lastName);
        setEmail(data.email);
        setUserImage(data.photo);
        if (jwt_decode(aToken).healer) {
          // IF IS HEALER
          setDesc(data.description);
          setBrand(data.brandName);
          setAddress(data.location.address);
          setCity(data.location.city);
          setProvince(data.location.province);
          setPostalCode(data.location.postalCode);
        }
      } catch (Error) {
        console.log(Error);
      }
    })();
  }, []);

  const handleUpload = (e) => {
    const data = new FormData();
    data.append('photo', e.target.files[0]);
    (async () => {
      try {
        const response = await fetch(
          process.env.REACT_APP_API_DOMAIN + '/users/photo',
          {
            method: 'PATCH',
            headers: {
              Authorization: 'Bearer ' + aToken,
            },
            body: data,
          }
        );
        setUserImage(URL.createObjectURL(e.target.files[0]));
      } catch (error) {
        console.log('Fetch API error - post ' + error);
      }
    })();
  };

  return (
    <div>
      <Paper className={`${classes.Paper} ${globalStyles.smlPgContainer}`}>
        <CssBaseline />
        <Grid container spacing={1}>
          <Grid
            item
            xs={12}
            className={`${classes.Grid} ${globalStyles.centerItems}`}
          >
            <PageTitle contents="Manage Account" />
          </Grid>
          <Grid
            item
            xs={12}
            className={`${classes.Grid} ${globalStyles.centerItems}`}
          >
            <Avatar
              src={userImage}
              variant="circle"
              className={classes.avatar}
            />
          </Grid>
          <Grid
            item
            xs={12}
            className={`${classes.Grid} ${globalStyles.centerItems}`}
          >
            <input
              accept="image/*"
              className={classes.input}
              id="contained-button-file"
              multiple
              type="file"
              onChange={handleUpload}
            />
          </Grid>
          <Grid
            item
            xs={12}
            className={`${classes.Grid} ${globalStyles.centerItems}`}
          >
            <label htmlFor="contained-button-file">
              <Button
                variant="outlined"
                component="span"
                color="primary"
                startIcon={<CloudUploadIcon />}
              >
                Profile Picture
              </Button>
            </label>
          </Grid>
        </Grid>
        <Formik
          enableReinitialize
          render={(props) => <FullNameEditForm {...props} />}
          validationSchema={schemaName}
          initialValues={{
            firstName: userFirstName,
            lastName: userLastName,
          }}
          onSubmit={(data) => {
            (async () => {
              try {
                const response = await fetch(
                  process.env.REACT_APP_API_DOMAIN + '/users/name',
                  {
                    method: 'PATCH',
                    mode: 'cors',
                    headers: {
                      Authorization: 'Bearer ' + aToken,
                      'Content-Type': 'application/json;charset=utf-8',
                    },
                    body: JSON.stringify(data),
                  }
                );
                history.push('/account'); // sends you to the login page after you make the account
                //maybe I should make it test to see if the account actually gets made but... no time!
              } catch (error) {
                console.log('Fetch API error - PATCH' + error);
              }
            })();
          }}
        />
        {jwt_decode(aToken).healer && (
          <Formik
            enableReinitialize
            render={(props) => <HealerInfoEditForm {...props} />}
            validationSchema={schemaHealerInfo}
            initialValues={{
              brandName: healerBrand,
              description: healerDesc,
              address: address,
              city: city,
              postalCode: postalCode,
              province: province,
            }}
            onSubmit={(data) => {
              data.location = {
                address: data.address,
                city: data.city,
                postalCode: data.postalCode,
                province: data.province,
                country: 'canada',
              };
              (async () => {
                try {
                  const response = await fetch(
                    process.env.REACT_APP_API_DOMAIN + '/users/healerProfile',
                    {
                      method: 'PUT',
                      mode: 'cors',
                      headers: {
                        Authorization: 'Bearer ' + aToken,
                        'Content-Type': 'application/json;charset=utf-8',
                      },
                      body: JSON.stringify(data),
                    }
                  );
                  history.push('/account'); // sends you to the login page after you make the account
                  //maybe I should make it test to see if the account actually gets made but... no time!
                } catch (error) {
                  console.log('Fetch API error - PATCH' + error);
                }
              })();
            }}
          />
        )}
        <Formik
          enableReinitialize
          render={(props) => <EmailEditForm {...props} />}
          validationSchema={schemaEmail}
          initialValues={{
            email: userEmail,
            password: '',
          }}
          onSubmit={(data) => {
            (async () => {
              try {
                await fetch(process.env.REACT_APP_API_DOMAIN + '/users/email', {
                  method: 'PATCH',
                  headers: {
                    Authorization: 'Bearer ' + aToken,
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(data),
                })
                  .then(function (response) {
                    return response.json();
                  })
                  .then(function (response) {
                    //CHECK
                    if (response.token) {
                      sessionStorage.setItem('token', response.token); // saves the token to session storage. I'm told this is unsafe.
                      //history.push('/account'); // go back to home page
                      //window.location.reload(); // reload's the whole page after, since I don't know how to make the app switch from NoAuthSite to AuthSite gracefully and this works, if ungracefully.
                    } else {
                      alert(
                        'Error: this email is invalid or already in use, or your password is incorrect'
                      );
                    }
                  });
              } catch (error) {
                console.log('Fetch API error - PATCH' + error);
              }
            })();
          }}
        />
        <Formik
          enableReinitialize
          render={(props) => <PasswordEditForm {...props} />}
          validationSchema={schemaPassword}
          initialValues={{
            newPassword: '',
            confirmPassword: '',
            oldPassword: '',
          }}
          onSubmit={(data) => {
            (async () => {
              try {
                const response = await fetch(
                  process.env.REACT_APP_API_DOMAIN + '/users/password',
                  {
                    method: 'PATCH',
                    mode: 'cors',
                    headers: {
                      Authorization: 'Bearer ' + aToken,
                      'Content-Type': 'application/json;charset=utf-8',
                    },
                    body: JSON.stringify(data),
                  }
                );
                //history.push('/account'); // sends you to the login page after you make the account
                //maybe I should make it test to see if the account actually gets made but... no time!
              } catch (error) {
                console.log('Fetch API error - PATCH' + error);
              }
            })();
          }}
        />
        <Box className={classes.link}>
          <Link href="/account" variant="body2">
            No changes needed? Go back to your profile
          </Link>
        </Box>
      </Paper>
      <Copyright />
    </div>
  );
};
export default AccountEdit;
