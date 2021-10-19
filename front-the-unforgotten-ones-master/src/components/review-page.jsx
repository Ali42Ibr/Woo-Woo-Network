/**  
 
*/
import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
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
import DefaultButton from './comps/defButton.jsx';
import PageTitle from './comps/pgTitle.jsx';
import SmallTextField from './comps/smlTextField.jsx';
import Rating from '@material-ui/lab/Rating';
import PropTypes from 'prop-types';
import globalStyles from './comps/globalStyling.module.css';

const schema = yup.object({
  // Schema says what's allowed in the forms and what's not.
  description: yup.string().min(4, 'Your description should be longer'),
});

const useStyles = makeStyles((theme) => ({
  reviewButton: {
    borderRadius: '16px',
    margin: '4px',
    color: '#ffffff',
    '&:hover': {
      backgroundColor: '#faeb3e',
      color: '#000000',
    },
  },
  reviewButton_Selected: {
    borderRadius: '16px',
    margin: '4px',
    backgroundColor: '#b1eb3b',
    color: '#ffffff',
    '&:hover': {
      backgroundColor: '#faeb3e',
      color: '#000000',
    },
  },
  reviewInfo: {
    width: '100%',
    padding: '8px',
    backgroundColor: theme.palette.background.orange,
    marginBottom: theme.spacing(2),
  },
}));
const aToken = sessionStorage.getItem('token');

const ratingLabel = `//.MuiRating-root {
  //margin-left: 8px;
  //margin-right: 8px;
}
.MuiRating-label {
  //margin-left: 8px;
  //margin-right: 8px;
}
//.MuiRating-visuallyhidden {
  //margin-left: 8px;
  //margin-right: 8px;
}`;

const ReviewForm = (props) => {
  const classes = useStyles();

  const {
    values: { rating, description },
    errors,
    touched,
    handleChange,
    handleSubmit,
    setFieldTouched,
    setRating,
    setDescription,
  } = props;

  const change = (name, e) => {
    e.persist();
    handleChange(e);
    setFieldTouched(name, true, false);
  };

  return (
    <Box width="100%">
      <form
        onSubmit={handleSubmit}
        className={`${classes.Box} ${globalStyles.centerItems}`}
      >
        {/*<Paper variant="body1" className={classes.reviewInfo}>
          <Grid container spacing={0}>
            <Grid item xs={6}>
              <Typography variant="body1">May 13th @ 9:30 AM</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography align="right" variant="body1">
                John Smith
              </Typography>
              <Typography align="right" variant="body1">
                Service #1
              </Typography>
            </Grid>
          </Grid>
        </Paper>*/}
        <style>{ratingLabel}</style>
        <Rating
          id="rating"
          name="rating"
          defaultValue={5}
          size="large"
          fullWidth
          precision={1}
          value={rating}
          //onChange={(rating) => setRating(rating)}
          onChange={change.bind(null, 'rating')}
        />
        <SmallTextField
          id="description"
          name="description"
          placeholder="Your review"
          fullWidth
          multiline
          rows={8}
          value={description}
          //onChange={(description) => setDescription(description)}
          onChange={change.bind(null, 'description')}
        />
        {/*<div display="flex" style={{ width: '100%', margin: '8px' }}>
          <Typography
            variant="body1"
            style={{ marginLeft: '16px', marginRight: '16px' }}
          >
            Tags
          </Typography>
          <Box className={`${classes.Box} ${globalStyles.tagContainer}`}>
            <ReviewButton contents="Loss" selected="true" />
            <ReviewButton contents="Stress" />
            <ReviewButton contents="Anxiety" />
            <ReviewButton contents="Anger" />
            <ReviewButton contents="Relationship" />
            <ReviewButton contents="Dietary Issue" />
          </Box>
        </div>*/}
        <DefaultButton
          type="submit"
          contents="Submit"
          style={{ width: '67%' }}
        />
      </form>
    </Box>
  );
};

const ReviewButton = (props) => {
  const classes = useStyles();

  if (props.selected) {
    return (
      <Button
        size="small"
        margin="dense"
        variant="contained"
        color="primary"
        className={classes.reviewButton_Selected}
        {...props}
      >
        {props.contents}
      </Button>
    );
  } else {
    return (
      <Button
        size="small"
        margin="dense"
        variant="contained"
        color="primary"
        className={classes.reviewButton}
        {...props}
      >
        {props.contents}
      </Button>
    );
  }
};

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const ReviewPage = (props) => {
  const classes = props;

  const query = useQuery();
  const appointmentId = query.get('appointmentId');
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState('');
  //console.log(formatDate(date));

  // API CALL TO RETRIEVE DIARY ENTRY OF SELECTED DATE
  {
    /*React.useEffect(() => {
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

        setEntry(data.description);
      } catch (Error) {
        //console.log(Error);
        setEntry([]);
      }
    })();
  }, []);*/
  }

  return (
    <div>
      <Paper className={`${classes.Paper} ${globalStyles.smlPgContainer}`}>
        <CssBaseline />
        <Box className={`${classes.Box} ${globalStyles.centerItems}`}>
          <PageTitle contents="Review" />
        </Box>
        <Formik
          enableReinitialize
          render={(props) => <ReviewForm {...props} />}
          validationSchema={schema}
          initialValues={{ rating: rating, description: description }}
          setRating={setRating}
          setDescription={setDescription}
          onSubmit={(data) => {
            (async () => {
              try {
                const response = await fetch(
                  process.env.REACT_APP_API_DOMAIN + '/reviews',
                  {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                      Authorization: 'Bearer ' + aToken,
                      'Content-Type': 'application/json;charset=utf-8',
                    },
                    body: JSON.stringify({
                      appointmentId: appointmentId,
                      rating: data.rating,
                      description: data.description,
                    }),
                  }
                );
                if (response.status == 201) {
                  alert('Your review was created.');
                  window.location.replace('/history');
                } else {
                  alert('Problem with creating review.');
                }
                //maybe I should make it test to see if the account actually gets made but... no time!
              } catch (error) {
                console.log('Fetch API error - post' + error);
              }
            })();
          }}
        />
      </Paper>
      <Copyright />
    </div>
  );
};
ReviewPage.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default ReviewPage;
