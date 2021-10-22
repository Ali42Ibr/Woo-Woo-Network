import React from 'react';
import './app/app.css';
import Button from '@material-ui/core/Button';
import { useForm } from 'react-hook-form';
import { Avatar, Grid } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import placeholderAvatar from '../media/avatar.jpg';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import jwt_decode from 'jwt-decode';
import globalStyles from './comps/globalStyling.module.css';

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
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  horizontal: {
    display: 'flex',
    flexDirection: 'row',
    margin: theme.spacing(0, 0, 2),
  },
  textContainer: {
    padding: theme.spacing(1.5),
  },
}));

// Holds all the info about the current user's account.
// gets the userid as a prop from the account page to fetch the data.

const AccountInfo = ({ userid }) => {
  const [userName, setName] = React.useState(String);
  const [userDesc, setDesc] = React.useState(String);
  const [userEmail, setEmail] = React.useState(String);
  const [userIsHealer, setIsHealer] = React.useState(5);
  const [userImage, setImage] = React.useState();
  // const [newImage, setNewImage] = React.useState([]);
  const aToken = sessionStorage.getItem('token');
  const [isHealer, setHealer] = React.useState(Boolean);

  // const { register, handleSubmit } = useForm();

  React.useEffect(() => {
    if (jwt_decode(sessionStorage.getItem('token')).healer) {
      setHealer(true);
    } else {
      setHealer(false);
    }
  }, [userIsHealer]);

  React.useEffect(() => {
    (async () => {
      try {
        // fetches the user data for this user.
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
        if (data.photo === '') {
          // user didnt upload picture yet
          setImage(placeholderAvatar);
        } else {
          setImage(data.photo); // sets the image on the screen as the URL we created
        }
        setName(data.firstName + ' ' + data.lastName);
        setIsHealer(data.isHealer);
        setEmail(data.email);
      } catch (Error) {
        console.log(Error);
      }
    })();
  }, []);

  const classes = useStyles();
  return (
    <div className={`${classes.div} ${globalStyles.centerItems}`}>
      <CssBaseline />
      <div className={classes.horizontal}>
        <Avatar src={userImage} variant="circle" className={classes.avatar} />
        <div className={classes.textContainer}>
          <Typography variant="body1">Name: {userName}.</Typography>
          <Typography variant="body1">Email: {userEmail}.</Typography>
          {isHealer && (
            <Typography variant="body1">Registered as a healer.</Typography>
          )}
        </div>
      </div>
    </div>
  );
};
export default AccountInfo;
