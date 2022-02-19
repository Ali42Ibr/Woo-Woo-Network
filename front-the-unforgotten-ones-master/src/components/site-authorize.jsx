import React from 'react';
import './app/app.css';
import NavBar from './header-logged-in.jsx';
import { Switch, Route } from 'react-router-dom';
import HealerPage from './healer-page.jsx';
import Home from './home.jsx';
import Account from './user-profile.jsx';
import AccountEdit from './account-edit.jsx';
import ManageServices from './services-page.jsx';
import jwt_decode from 'jwt-decode';
import BookingPage from './booking-page';
import SchedulePage from './schedule-page';
import ServicesPage from './services-page.jsx';
import AppointmentHistory from './appointment-history';
import DiaryPage from './diary-page';
import ReschedulePage from './reschedule-page';
import ReviewPage from './review-page';
import AboutUs from './about-us';
import PrivacyPolicy from './privacy-policy';

/** 
 * 
 * CONDITIONAL RENDERING: FIRST OF ALL NEEDS TO CHECK IF USER LOGGED IN OR NOT
  
  This component is the one that renders when you are logged in.
  It doesn't contain the create account or login pages, but instead
  has the account and accountEdit page, as well as the logout button.

  This component renders when you are NOT logged in. It has the login and signup pages,
  while the logged-in version would NOT have these. You can still look at healer pages
  while NOT logged in.

 */

const AuthSite = ({ logout, user }) => {
  const [userName, setUserName] = React.useState(String);
  const decodedToken = jwt_decode(user);
  console.log('hi');
  console.log(decodedToken);

  React.useEffect(() => {
    (async () => {
      try {
        const decodedId = jwt_decode(user).user_id;
        const aToken = sessionStorage.getItem('token');
        const token = jwt_decode(aToken);
        const expirationTime = token.exp * 1000 - 60000;
        if (Date.now() >= expirationTime) {
          logout();
        }
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
        setUserName(() => data.firstName);
      } catch (Error) {
        console.log(Error);
      }
    })();
  }, []);

  return (
    <div className="App">
      <NavBar />
      <div className="App-body">
        {userName ? (
          <h2 style={{ textAlign: 'center' }}>Welcome, {userName}.</h2>
        ) : (
          <h2 style={{ textAlign: 'center' }}>Welcome</h2>
        )}
        <Switch>
          {' '}
          {/* The Switch decides which component to show based on the current URL.*/}
          <Route exact path="/" component={Home}></Route>
          <Route exact path="/home" component={Home}></Route>
          <Route exact path="/healers/:id" component={HealerPage}></Route>
          <Route exact path="/account" component={Account}></Route>
          <Route exact path="/accountedit" component={AccountEdit}></Route>
          {decodedToken.healer && (
            <Route exact path="/services" component={ManageServices}></Route>
          )}
          <Route exact path="/logout" render={logout}></Route>
          <Route exact path="/booking/:id" render={BookingPage}></Route>
          <Route exact path="/schedule" render={SchedulePage}></Route>
          <Route exact path="/services" component={ServicesPage}></Route>
          <Route exact path="/history" component={AppointmentHistory}></Route>
          <Route exact path="/diary" component={DiaryPage}></Route>
          <Route exact path="/reschedule" component={ReschedulePage}></Route>
          <Route path="/review" component={ReviewPage}></Route>
          <Route exact path="/about-us" component={AboutUs}></Route>
          <Route exact path="/privacy-policy" component={PrivacyPolicy}></Route>
        </Switch>
      </div>
    </div>
  );
};
export default AuthSite;
