import React from 'react';
import './app/app.css';
import jwt_decode from 'jwt-decode';
import { Grid, Paper, CssBaseline, makeStyles, Box } from '@material-ui/core';
import AccountInfo from './account-info';
import Copyright from './copyright';
import SmallClearButton from './comps/smlClearButton';
import UpcomingAppointments from './upcoming-appointments';
import globalStyles from './comps/globalStyling.module.css';

const useStyles = makeStyles((theme) => ({
  pgNavBar: {
    display: 'flex',
    justifyContent: 'space-evenly',
    marginBottom: theme.spacing(3),
  },
  datePicker: {
    zIndex: 1,
    width: '50%',
  },
}));

// Hols the basic rectangle layout of the account page.
const AccountPage = () => {
  const classes = useStyles();

  // if you ARE logged in :
  if (sessionStorage.getItem('token') != null) {
    const decodedToken = jwt_decode(sessionStorage.getItem('token'));
    return (
      <div>
        <Paper
          className={`${classes.Paper} ${globalStyles.defPgContainer}`}
          style={{ paddingTop: '10px' }}
        >
          <CssBaseline />
          <Box className={`${classes.Box} ${globalStyles.pgNavBar}`}>
            <Grid container spacing={1}>
              {decodedToken.healer && (
                <>
                  <Grid
                    item
                    xs={4}
                    className={`${classes.Grid} ${globalStyles.centerItems}`}
                  >
                    <SmallClearButton
                      type="submit"
                      href="/schedule"
                      contents="Manage Schedule"
                    />
                  </Grid>
                  <Grid
                    item
                    xs={4}
                    className={`${classes.Grid} ${globalStyles.centerItems}`}
                  >
                    <SmallClearButton
                      type="submit"
                      href="/services"
                      contents="Manage Services"
                    />
                  </Grid>
                </>
              )}
              <Grid
                item
                xs={4}
                className={`${classes.Grid} ${globalStyles.centerItems}`}
              >
                <SmallClearButton
                  type="submit"
                  href="/accountedit"
                  contents="Edit Information"
                />
              </Grid>
              {decodedToken.healer && <Grid item xs={2}></Grid>}
              <Grid
                item
                xs={4}
                className={`${classes.Grid} ${globalStyles.centerItems}`}
              >
                <SmallClearButton
                  type="submit"
                  href="/history"
                  contents="Appointment History"
                />
              </Grid>
              <Grid
                item
                xs={4}
                className={`${classes.Grid} ${globalStyles.centerItems}`}
              >
                <SmallClearButton
                  type="submit"
                  href="/diary"
                  contents="My Journal"
                />
              </Grid>
              {decodedToken.healer && <Grid item xs={2}></Grid>}
            </Grid>
          </Box>
          <AccountInfo userid={decodedToken.user_id} />
          <UpcomingAppointments />
        </Paper>
        <Copyright />
      </div>
    );
  } else {
    // if you are NOT logged in
    return (
      <div lg="12">
        <Paper className={`${classes.Paper} ${globalStyles.smlPgContainer}`}>
          <p>You are not logged in!</p>
        </Paper>
        <Copyright />
        <hr />
      </div>
    );
  }
};
export default AccountPage;
