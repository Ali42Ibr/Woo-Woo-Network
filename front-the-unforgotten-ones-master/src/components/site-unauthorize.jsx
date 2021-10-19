import React, { useState } from 'react';
import './app/app.css';
import NavBar from './header-logged-out.jsx';
import { Switch, Route } from 'react-router-dom';
import HealerPage from './healer-page.jsx';
import LoginPage from './login-page.jsx';
import Home from './home.jsx';
import SignUp from './create-account.jsx';
import ForgotPasswordPage from './forgot-password-page';
import EmailSentPage from './email-sent';
import AboutUs from './about-us';
import PrivacyPolicy from './privacy-policy';
import jwt_decode from 'jwt-decode';

/**  This component renders when you are not logged in. It has the login and signup pages,
  while the logged-in version would not have these. You can still look at healer pages
  while not logged in.
*/
const NoAuthSite = (props) => {
  return (
    <div className="App">
      <NavBar />
      <div className="App-body">
        {props.text ? <h2 align="center">{props.text}</h2> : ''}
        <Switch>
          {' '}
          {/* The Switch decides which component to show based on the current URL.*/}
          <Route exact path="/" component={Home}></Route>
          <Route exact path="/home" component={Home}></Route>
          <Route exact path="/healers/:id" component={HealerPage}></Route>
          <Route exact path="/login" component={LoginPage}></Route>
          <Route exact path="/signup" component={SignUp}></Route>
          <Route
            exact
            path="/forgot-password"
            component={ForgotPasswordPage}
          ></Route>
          <Route exact path="/email-sent" component={EmailSentPage}></Route>
          <Route exact path="/about-us" component={AboutUs}></Route>
          <Route exact path="/privacy-policy" component={PrivacyPolicy}></Route>
        </Switch>
      </div>
    </div>
  );
};
export default NoAuthSite;
