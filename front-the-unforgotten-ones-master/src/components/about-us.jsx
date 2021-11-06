/**  
 
//  updated message 

Kimberlee Klein has worked on projects like developing pregnancy loss
programs to help people with grief and an app that will help people give
away their leftovers that would otherwise go bad. She came up with the 
idea for Woo Woo Net after noticing a trend with the healers she&apos;s
seen in her career. Many healers find it difficult to market their
services and accept payments from their clients. The project aims to
make it easier for both clients and healers to interact with one another. 



*/
import React, { useState } from 'react';
import Copyright from './copyright.jsx';
import AddIcon from '@material-ui/icons/Add';
import {
  Grid,
  Paper,
  Typography,
  Box,
  CssBaseline,
  makeStyles,
} from '@material-ui/core';
import PageTitle from './comps/pgTitle.jsx';
import PropTypes from 'prop-types';
import backgroundImage from '../media/background.jpeg';
import globalStyles from './comps/globalStyling.module.css';

const useStyles = makeStyles((theme) => ({
  flavorImage: {
    //boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.25)',
    position: 'relative',
    backgroundImage: 'url(https://source.unsplash.com/random)',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'calc(50% - 0px) calc(50% - 0px)',
    height: '250px',
    margin: theme.spacing(0, -6, 4),
    padding: theme.spacing(6),
  },
  after: {
    '&:after': {
      backgroundImage:
        'linear-gradient(350deg,rgb(242,105,36) 0%,rgb(250,240,125) 53%,rgb(205,245,122) 85%)',
      //filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#002f4b', endColorstr='#00000000',GradientType=0 ),
    },
  },
  message: {
    marginTop: theme.spacing(2),
    textAlign: 'center',
    textShadow: '0px 2px 12px #ffffff',
  },
  header: {
    margin: theme.spacing(4, 4, 2),
  },
  text: {
    margin: theme.spacing(2, 6),
  },
}));

const PageContent = (props) => {
  const classes = useStyles();

  return (
    <div style={{ width: '100%' }}>
      <Box className={classes.after}>
        <Box
          className={classes.flavorImage}
          style={{
            backgroundImage: `url(${backgroundImage})`,
          }}
        >
          <img
            style={{
              display: 'none',
            }}
            src={backgroundImage}
            alt="alt image line 54"
          />
          <Typography variant="h3" className={classes.message}>
            Our mission is to help clients find their Healer.
          </Typography>
        </Box>
      </Box>
      <Typography variant="body1" className={classes.text}>
        This website was a Camosun College student capstone project sponsored by
        the social entrepreneur, Kimberlee Klein.
      </Typography>
      <Typography variant="body1" className={classes.text}>
        The project has since been built upon by students at UBCO.
      </Typography>
      <Typography variant="body1" className={classes.text}>
        Kimberlee Klein has worked on projects like developing pregnancy loss
        programs to help people with grief and an app that will help people give
        away their leftovers that would otherwise go bad. She came up with the
        idea for Woo Woo Net after noticing a trend with the healers she&apos;s
        interacted with in her career. Many healers find it difficult to list
        their services and accept payments from clients. The project aims to
        make it easier for both clients and healers to interact with each other.
      </Typography>
      {/*<br></br>
      <br></br>
      <Typography variant="h5" className={classes.header}>
        Sponsor
      </Typography>
      <Typography variant="body1" className={classes.text}>
        Clients The client is, social entrepreneur, Kimberlee Klein. She&apos;s
        worked on projects like developing pregnancy loss programs to help
        people with grief and an app that will help people give away their
        leftovers that would otherwise go bad. She proposed the project as a
        capstone project after hearing about the program through a colleague.
      </Typography>
      <Typography variant="h5" className={classes.header}>
        Project
      </Typography>
      <Typography variant="body1" className={classes.text}>
        Kimberlee conceived this project after noticing a trend with the healers
        she&apos;s interacted with in her career; that many healers find it
        difficult to market their services and accept payments from their
        clients. She was inspired by the Airbnb model of offering a service,
        reducing the conversation of money, and money being transferred after
        the service is complete. The project aims to make it easy for clients to
        search for healers that fit their needs and the interaction between
        client and healer as smooth as possible.
      </Typography>*/}
    </div>
  );
};

const AboutUs = (props) => {
  const classes = props;

  return (
    <div>
      <Paper className={`${classes.Paper} ${globalStyles.defPgContainer}`}>
        <CssBaseline />
        <div className={`${globalStyles.centerItems}`}>
          <PageTitle align="center" contents="About Us" />
          <PageContent />
        </div>
      </Paper>
      <Copyright />
    </div>
  );
};
AboutUs.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default AboutUs;
