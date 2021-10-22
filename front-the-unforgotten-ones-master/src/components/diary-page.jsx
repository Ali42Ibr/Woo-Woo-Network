/**  
 
*/
import React, { useState } from 'react';
import * as yup from 'yup';
import { Formik } from 'formik';
import Copyright from './copyright.jsx';
import AddIcon from '@material-ui/icons/Add';
import {
  Grid,
  Paper,
  Typography,
  Box,
  CssBaseline,
  makeStyles,
  List,
  ListItem,
  Button,
} from '@material-ui/core';
import SmallButton from './comps/smlButton';
import SmallClearButton from './comps/smlClearButton.jsx';
import DefaultButton from './comps/defButton.jsx';
import DefaultDayPicker from './comps/defDayPicker.jsx';
import PageTitle from './comps/pgTitle.jsx';
import SmallTextField from './comps/smlTextField.jsx';
import SaveButton from './comps/saveButton.jsx';
import PropTypes from 'prop-types';
import globalStyles from './comps/globalStyling.module.css';

const schema = yup.object({
  // Schema says what's allowed in the forms and what's not.
  description: yup.string().trim().min(1, 'Your entry should be longer'),
});

const useStyles = makeStyles((theme) => ({
  placeholder: {
    width: '100%',
  },
}));
const aToken = sessionStorage.getItem('token');

const Entry = (props) => {
  const classes = useStyles();

  const {
    values: { description, date },
    errors,
    touched,
    handleChange,
    handleSubmit,
    setFieldTouched,
  } = props;

  const change = (name, e) => {
    e.persist();
    handleChange(e);
    setFieldTouched(name, true, false);
  };

  return (
    <form width="100%" onSubmit={handleSubmit}>
      <div className={`${classes.div} ${globalStyles.centerItems}`}>
        <SmallTextField
          id="description"
          fullWidth
          multiline
          rows={12}
          value={description}
          //onChange={(entry) => setEntry(entry.target.value)}
          onChange={change.bind(null, 'description')}
        />
        <SaveButton type="submit" style={{ width: '67%' }} />
      </div>
    </form>
  );
};

const DiaryPage = (props) => {
  const classes = props;

  function formatDate(date) {
    var month = '' + (date.getMonth() + 1),
      day = '' + date.getDate(),
      year = date.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  function setAndGetEntry(date) {
    setDate(date);
    (async () => {
      try {
        // fetches the user data for this user.
        const response = await fetch(
          process.env.REACT_APP_API_DOMAIN +
            '/diaries?date=' +
            formatDate(date),
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

        if (data.description != null) {
          setEntry(data.description);
        } else {
          setEntry('');
        }
      } catch (Error) {
        console.log(Error);
      }
    })();
  }

  // API CALL TO RETRIEVE DIARY ENTRY OF SELECTED DATE
  React.useEffect(() => {
    setAndGetEntry(date);
  }, []);

  const [date, setDate] = useState(new Date());
  const [entry, setEntry] = useState([]);
  //console.log(formatDate(date));

  return (
    <div>
      <Paper className={`${classes.Paper} ${globalStyles.defPgContainer}`}>
        <CssBaseline />
        <div className={`${classes.div} ${globalStyles.centerItems}`}>
          <PageTitle contents="Diary" />
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <DefaultDayPicker
                date={date}
                onChange={(date) => setAndGetEntry(date)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Formik
                enableReinitialize
                render={(props) => <Entry {...props} />}
                validationSchema={schema}
                initialValues={{ description: entry, date: date }}
                onSubmit={(data) => {
                  (async () => {
                    try {
                      const response = await fetch(
                        process.env.REACT_APP_API_DOMAIN + '/diaries',
                        {
                          method: 'POST',
                          mode: 'cors',
                          headers: {
                            Authorization: 'Bearer ' + aToken,
                            'Content-Type': 'application/json;charset=utf-8',
                          },
                          body: JSON.stringify({
                            description: data.description,
                            date: formatDate(data.date),
                          }),
                        }
                      );
                      if (response.status == 200) {
                        alert('Your diary entry was updated.');
                        //window.location.reload();
                      } else if (response.status == 201) {
                        alert('Your diary entry was created.');
                        //window.location.reload();
                      } else {
                        alert('Problem with diary entry.');
                      }
                      //maybe I should make it test to see if the account actually gets made but... no time!
                    } catch (error) {
                      console.log('Fetch API error - post' + error);
                    }
                  })();
                }}
              />
            </Grid>
          </Grid>
        </div>
      </Paper>
      <Copyright />
    </div>
  );
};
DiaryPage.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default DiaryPage;
