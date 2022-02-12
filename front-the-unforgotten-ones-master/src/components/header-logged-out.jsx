import {
  AppBar,
  Toolbar,
  Typography,
  makeStyles,
  Button,
  IconButton,
  Drawer,
  //Link,
  MenuItem,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import React, { useState, useEffect } from 'react';
// import { Link as RouterLink } from 'react-router-dom';
import { HashLink as Link } from 'react-router-hash-link';
import './app/app.css';
//import logo
import phoenixLogo from '../media/phoenixLogo.svg';

// if user is logged in, the nav bar icons will display as : Home, Healers, Account, Logout
// is user is NOT logged in: Home, Sign Up, Login, Healers,

const headersDataLoggedOut = [
  {
    label: 'Search',
    href: '/home#healers_section',
  },
  {
    label: 'About us',
    href: '/about-us',
  },
  {
    label: 'Sign Up',
    href: '/signup',
  },
  {
    label: 'Login',
    href: '/login',
  },
  {
    label: 'Near Me',
    href: '/nearme',
  },
];

// Styles to be changed - made navbar responsive for mobile use
const useStyles = makeStyles(() => ({
  header: {
    backgroundColor: '#FFFFFF',
    paddingRight: '0px',
    paddingLeft: '0px',
    position: 'static',
  },
  logo: {
    fontFamily: 'Laila, sans-serif',
    fontWeight: 400,
    color: '#343434',
    marginLeft: '70px',
    paddingTop: '10px',
  },
  menuButton: {
    fontFamily: 'Laila, sans-serif',
    fontWeight: 400,
    size: '18px',
    marginLeft: '38px',
    marginRight: '38px',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    //boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.25)',
  },
  drawerContainer: {
    padding: '20px 30px',
  },
  phoenix: {
    marginRight: '14.57px',
    overflow: 'hidden',
    position: 'relative',
    maxWidth: 40,
    float: 'left',
  },
  websiteLogo: {
    textDecoration: 'none',
  },
}));

function NavBar() {
  const { header, logo, menuButton, toolbar, drawerContainer, phoenix } =
    useStyles();

  const [state, setState] = useState({
    mobileView: false,
    drawerOpen: false,
  });

  const { mobileView, drawerOpen } = state;

  useEffect(() => {
    const setResponsiveness = () => {
      return window.innerWidth < 900
        ? setState((prevState) => ({ ...prevState, mobileView: true }))
        : setState((prevState) => ({ ...prevState, mobileView: false }));
    };

    setResponsiveness();

    window.addEventListener('resize', () => setResponsiveness());
  }, []);

  const displayDesktop = () => {
    return (
      <Toolbar className={toolbar}>
        <WebsiteLogo />
        <div>{getMenuButtons()}</div>
      </Toolbar>
    );
  };

  const displayMobile = () => {
    const handleDrawerOpen = () =>
      setState((prevState) => ({ ...prevState, drawerOpen: true }));
    const handleDrawerClose = () =>
      setState((prevState) => ({ ...prevState, drawerOpen: false }));

    return (
      <Toolbar className={toolbar}>
        <WebsiteLogo />
        <Drawer
          {...{
            anchor: 'right',
            open: drawerOpen,
            onClose: handleDrawerClose,
          }}
        >
          <div className={drawerContainer}>{getDrawerChoices()}</div>
        </Drawer>
        <div>
          <IconButton
            {...{
              edge: 'false',
              color: 'inherit',
              'aria-label': 'menu',
              'aria-haspopup': 'true',
              onClick: handleDrawerOpen,
            }}
          >
            <MenuIcon />
          </IconButton>
        </div>
      </Toolbar>
    );
  };

  const getDrawerChoices = () => {
    return headersDataLoggedOut.map(({ label, href }) => {
      return (
        <Link
          key={label}
          {...{
            to: href,
            color: 'inherit',
            style: { textDecoration: 'none', color: 'black' },
            key: label,
          }}
        >
          <MenuItem>{label}</MenuItem>
        </Link>
      );
    });
  };

  const WebsiteLogo = () => {
    const { websiteLogo } = useStyles();
    return (
      <div>
        <a href="/home#landing" className={websiteLogo}>
          <img src={phoenixLogo} className={phoenix} />
          <Typography variant="h6" component="h1" className={logo}>
            The Woo Woo Network
          </Typography>
        </a>
      </div>
    );
  };

  const getMenuButtons = () => {
    return headersDataLoggedOut.map(({ label, href }) => {
      return (
        <Button
          key={label}
          {...{
            key: label,
            color: 'inherit',
            href: href,
            className: menuButton,
          }}
        >
          {label}
        </Button>
      );
    });
  };

  return (
    <header>
      <AppBar className={header}>
        {mobileView ? displayMobile() : displayDesktop()}
      </AppBar>
    </header>
  );
}

export default NavBar;
