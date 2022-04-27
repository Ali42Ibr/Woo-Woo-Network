import React, { useState } from 'react';
import Copyright from './copyright.jsx';
import * as yup from 'yup';
import { Formik } from 'formik';
import AddIcon from '@material-ui/icons/Add';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Checkbox,
  CssBaseline,
  FormControlLabel,
  makeStyles,
  List,
  ListItem,
} from '@material-ui/core';
import SmallTextField from './comps/smlTextField';
import SaveButton from './comps/saveButton';
import DeleteButton from './comps/delButton';
import CashTextField from './comps/cashTextField';
import MoreButton from './comps/moreButton';
import PageTitle from './comps/pgTitle.jsx';
import globalStyles from './comps/globalStyling.module.css';
import { ContactsOutlined } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({}));
const aToken = sessionStorage.getItem('token');

/** Main renderer */
function Tags() {
  const classes = useStyles();

  const [services, setServices] = useState([]);
  const [healerID, setHealerId] = useState();

  const [searchTag, setSearchTag] = useState([]);
  const [tags, setTags] = useState([]);

  function clickSearch(props) {
    if (props == 'Clear') {
      setSearchTag([]);
    } else if (searchTag.includes(props)) {
      let newSearchTag = [];
      for (let i = 0; i < searchTag.length; i++) {
        if (searchTag[i] != props && searchTag[i] != undefined) {
          newSearchTag.push(searchTag[i]);
        }
      }
      setSearchTag(newSearchTag);
    } else if (!searchTag.includes(props)) {
      let newArray = searchTag;
      newArray.push(props);
      setSearchTag([...newArray]);
    }
  }

  function postTags(props) {
    console.log('props');
    console.log(props);
    (async () => {
      try {
        const response = await fetch(
          process.env.REACT_APP_API_DOMAIN + '/tags',
          {
            method: 'POST',
            mode: 'cors',
            headers: {
              Authorization: 'Bearer ' + aToken,
              'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify(props),
          }
        );
      } catch (error) {
        console.log('123');
      }
    })();
    window.location.reload(false);
  }

  // API CALL TO RETRIEVE INFORMATION ABOUT A HEALER'S SERVICES
  // NEED TO TEST TO SEE IF THE USER ID WE USE HERE IS CORRECT
  // SHOULD RETURN A LIST OF SERVICES PROVIDED BY A HEALER

  React.useEffect(() => {
    (async () => {
      try {
        const response = await fetch(
          process.env.REACT_APP_API_DOMAIN + '/tags',
          {
            method: 'GET',
            headers: {
              Authorization: 'Bearer ' + aToken,
              'Content-Type': 'application/json',
            },
          }
        );
        const data = await response.json();
        console.log(data);
        console.log('here');
        setTags(data);
      } catch (Error) {
        console.log(Error);
      }
    })();
  }, []);

  if (services) {
    return (
      <div>
        <Paper className={`${classes.Paper} ${globalStyles.smlPgContainer}`}>
          <CssBaseline />
          <Box className={`${classes.Box} ${globalStyles.centerItems}`}>
            <PageTitle contents="Manage Tags" />
          </Box>
          <h3>Current tags: </h3>
          {console.log(tags)}
          {console.log('here')}
          {tags.map((tag, i) => {
            return <p key={i}>{tag.name}</p>;
          })}
          <button
            style={{ color: searchTag.includes(0) ? 'green' : 'black' }}
            onClick={() => clickSearch(0)}
          >
            Anxiety
          </button>
          <button
            style={{
              color: searchTag.includes(2) ? 'green' : 'black',
            }}
            onClick={() => clickSearch(2)}
          >
            Love life
          </button>
          <button
            style={{
              color: searchTag.includes(3) ? 'green' : 'black',
            }}
            onClick={() => clickSearch(3)}
          >
            Family relationships
          </button>
          <button
            style={{
              color: searchTag.includes(4) ? 'green' : 'black',
            }}
            onClick={() => clickSearch(4)}
          >
            Life purpose
          </button>
          <button
            style={{
              color: searchTag.includes(5) ? 'green' : 'black',
            }}
            onClick={() => clickSearch(5)}
          >
            Depression
          </button>
          {console.log(searchTag)}
          <SaveButton onClick={() => postTags(searchTag)} fullWidth />
        </Paper>
        <Copyright />
      </div>
    );
  } else {
    return <div>Loading...</div>;
  }
}
export default Tags;
