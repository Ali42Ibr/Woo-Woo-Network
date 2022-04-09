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

const schema = yup.object({
  // Schema says what's allowed in the forms and what's not.
  name: yup
    .string()
    .trim()
    .min(2, 'Your service name must be at least 2 characters.')
    .matches(
      /^[A-Z a-z]+$/,
      'Invalid name. Use Upper or Lowercase letters only.'
    )
    .required('Your first name is required'),
  description: yup.string().trim().min(4, 'Your description should be longer'),
  cleanUpTime: yup
    .number()
    .positive()
    .integer('Please enter whole number for minutes.'),
  timeLength: yup
    .number()
    .positive()
    .integer('Please enter whole number for minutes.'),
  price: yup.number().positive(),
});

const useStyles = makeStyles((theme) => ({}));
const aToken = sessionStorage.getItem('token');

const HealerTags = (props) => {
  console.log('Im here!!');
  console.log(props);
  return null;
};

const HealerServices = (props) => {
  const classes = useStyles();
  const [showComponent, setShowComponent] = useState(false);

  function handleAddService() {
    // THIS HANDLES THE ACTION OF A USER CLICKING THE "+" BUTTON TO ADD A
    // NEW SERVICE , IT RENDERS THE SELECTED LIST ITEM COMPONENT.
    setShowComponent(true);
  }
  return (
    <List className={`${classes.List} ${globalStyles.list}`}>
      {/* {MAPPING SERVICES, WILL BE EITHER ODD, EVEN OR SELECTED.} */}

      {props.services.map((service, i) => (
        <ServiceListItem
          name={service.name}
          price={service.price}
          key={service + i}
          description={service.description}
          timeLength={service.timeLength}
          cleanUpTime={service.cleanUpTime}
          isAvailableOnline={service.isAvailableOnline}
          id={service.id}
          healerProfileId={service.healerProfileId}
          className={
            i % 2
              ? `${classes.ListItem} ${globalStyles.listEven}`
              : `${classes.ListItem} ${globalStyles.listOdd}`
          }
        />
      ))}
      {showComponent ? (
        <Formik
          enableReinitialize
          render={(props) => <ServiceListItem_New {...props} />}
          validationSchema={schema}
          initialValues={{
            name: '',
            price: '',
            description: '',
            timeLength: '',
            cleanUpTime: '',
            isAvailableOnline: false,
          }}
          onSubmit={(data) => {
            console.log(data);
            (async () => {
              try {
                const response = await fetch(
                  process.env.REACT_APP_API_DOMAIN + '/services',
                  {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                      Authorization: 'Bearer ' + aToken,
                      'Content-Type': 'application/json;charset=utf-8',
                    },
                    body: JSON.stringify(data),
                  }
                );
                console.log(response);
                if (response.status == 201) {
                  alert('Your service was created.');
                  window.location.reload();
                } else {
                  alert('Problem with service.');
                }
                //maybe I should make it test to see if the account actually gets made but... no time!
              } catch (error) {
                console.log('Fetch API error - post' + error);
              }
            })();
          }}
        />
      ) : null}
      <ListItem
        className={
          props.services.length % 2
            ? `${classes.ListItem} ${globalStyles.listEven}`
            : `${classes.ListItem} ${globalStyles.listOdd}`
        }
      >
        <MoreButton
          endIcon={<AddIcon />}
          onClick={handleAddService}
          contents="Add Service"
        />
      </ListItem>
    </List>
  );
};

const ServiceListItem = (props) => {
  const classes = useStyles();
  const [showComponent, setShowComponent] = useState(false);

  function handleClick() {
    console.log('on click');
    showComponent ? setShowComponent(false) : setShowComponent(true);
  }

  if (showComponent) {
    return (
      <ListItem {...props}>
        <Grid container spacing={0}>
          <Grid item xs={6} backgroundColor="transparent">
            <Typography onClick={handleClick} variant="body1">
              {props.name}
            </Typography>
          </Grid>
          <Grid item xs={6} backgroundColor="transparent">
            <Typography align="right" variant="body1">
              ${props.price}
            </Typography>
          </Grid>
        </Grid>
        <Formik
          enableReinitialize
          render={(props) => <ServiceListItem_New {...props} />}
          validationSchema={schema}
          initialValues={{
            name: props.name,
            price: props.price,
            description: props.description,
            timeLength: props.timeLength,
            cleanUpTime: props.cleanUpTime,
            isAvailableOnline: props.isAvailableOnline,
            id: props.id,
          }}
          onSubmit={(data) => {
            console.log(data);
            (async () => {
              try {
                const response = await fetch(
                  process.env.REACT_APP_API_DOMAIN + '/services/' + data.id,
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
                console.log(response);
                if (response.status == 200 || response.status == 204) {
                  alert('Your service was updated.');
                  window.location.reload();
                } else {
                  alert('Problem with updating service. Check all fields.');
                }
              } catch (error) {
                console.log('Fetch API error - PUT' + error);
              }
            })();
          }}
        />
      </ListItem>
    );
  } else {
    return (
      <ListItem onClick={handleClick} {...props}>
        <Grid container spacing={0}>
          <Grid item xs={6} backgroundColor="transparent">
            <Typography variant="body1">{props.name}</Typography>
          </Grid>
          <Grid item xs={6} backgroundColor="transparent">
            <Typography align="right" variant="body1">
              ${props.price}
            </Typography>
          </Grid>
        </Grid>
      </ListItem>
    );
  }
};

const ServiceListItem_New = (props) => {
  const classes = useStyles();

  const {
    values: {
      name,
      description,
      timeLength,
      cleanUpTime,
      price,
      isAvailableOnline,
      id,
    },
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

  function handleDelete(serviceID) {
    console.log(serviceID);
    if (serviceID) {
      //API CALL TO DELETE A SERVICE FROM THE HEALERS SERVICES
      (async () => {
        try {
          const response = await fetch(
            process.env.REACT_APP_API_DOMAIN + '/services/' + serviceID,
            {
              method: 'DELETE',
              mode: 'cors',
              headers: {
                Authorization: 'Bearer ' + aToken,
              },
            }
          );
          console.log(response);
          if (response.status == 200 || response.status == 204) {
            alert('Your service was successfully deleted.');
            window.location.reload();
          } else {
            alert('Problem with deleting service. Check all fields.');
          }
        } catch (error) {
          console.log('Fetch API error - post' + error);
        }
      })();
    } else {
      window.location.reload();
    }
  }

  return (
    <ListItem className={`${classes.ListItem} ${globalStyles.listSelected}`}>
      <form width="100%" onSubmit={handleSubmit}>
        <SmallTextField
          id="name"
          label="Service Name"
          autoComplete="sname"
          value={name}
          autoFocus
          required
          fullWidth
          helperText={touched.name ? errors.name : ''}
          error={touched.name && Boolean(errors.name)}
          onChange={change.bind(null, 'name')}
        />
        <SmallTextField
          id="description"
          label="Service Description"
          autoComplete="sdesc"
          value={description}
          required
          fullWidth
          multiline
          rows={4}
          helperText={touched.description ? errors.description : ''}
          error={touched.description && Boolean(errors.description)}
          onChange={change.bind(null, 'description')}
        />
        <SmallTextField
          id="timeLength"
          label="Length in Minutes"
          autoComplete="slength"
          value={timeLength}
          required
          fullWidth
          inputProps={{
            type: 'number',
          }}
          helperText={touched.timeLength ? errors.timeLength : ''}
          error={touched.timeLength && Boolean(errors.timeLength)}
          onChange={change.bind(null, 'timeLength')}
        />
        <SmallTextField
          id="cleanUpTime"
          label="Clean-up in Minutes"
          autoComplete="scleanup"
          value={cleanUpTime}
          required
          fullWidth
          inputProps={{
            type: 'number',
          }}
          helperText={touched.cleanUpTime ? errors.cleanUpTime : ''}
          error={touched.cleanUpTime && Boolean(errors.cleanUpTime)}
          onChange={change.bind(null, 'cleanUpTime')}
        />
        <CashTextField
          id="price"
          label="CAD"
          autoComplete="scost"
          value={price}
          required
          fullWidth
          inputProps={{
            type: 'number',
            step: 0.5,
          }}
          helperText={touched.price ? errors.price : ''}
          error={touched.price && Boolean(errors.price)}
          onChange={change.bind(null, 'price')}
        />
        <FormControlLabel
          control={
            <Checkbox
              color="primary"
              name="isAvailableOnline"
              value={isAvailableOnline}
              checked={isAvailableOnline}
              onChange={change.bind(null, 'isAvailableOnline')}
            />
          }
          label="Available via online"
        />
        <Box display="flex">
          <SaveButton disabled={!isValid} type="submit" fullWidth />
          <DeleteButton onClick={() => handleDelete(id)} />
        </Box>
      </form>
    </ListItem>
  );
};

const CancelationFee = (props) => {
  const classes = useStyles();

  const {
    values: { fee, appliedDay },
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
    <form
      width="100%"
      onSubmit={handleSubmit}
      validationschema={schema}
      className={`${classes.Box} ${globalStyles.centerItems}`}
    >
      <Box className={`${classes.Box} ${globalStyles.centerVertical}`}>
        <CashTextField
          id="fee"
          label={appliedDay ? '' : 'CAD'}
          value={fee}
          autoComplete="ccost"
          required
          inputProps={{
            type: 'number',
            step: 0.5,
            pattern: '[0-9]*',
          }}
          onChange={change.bind(null, 'fee')}
        />
        <Box marginLeft="8px">
          <Typography variant="body1">within</Typography>
        </Box>
      </Box>
      <Box className={`${classes.Box} ${globalStyles.centerVertical}`}>
        <SmallTextField
          id="appliedDay"
          label={appliedDay ? '' : '# of Days'}
          value={appliedDay}
          autoComplete="cdays"
          required
          inputProps={{
            type: 'number',
            pattern: '[0-9]*',
          }}
          onChange={change.bind(null, 'appliedDay')}
        />
        <Box marginLeft="8px">
          <Typography variant="body1">days of appointment</Typography>
        </Box>
      </Box>
      <Box className={`${classes.Box} ${globalStyles.centerItems}`}>
        <SaveButton type="submit" />
      </Box>
    </form>
  );
};
const TagContent = (props) => {
  const classes = useStyles();

  React.useEffect(() => {
    return (
      <div>
        <CssBaseline />
        <Box className={`${classes.Box} ${globalStyles.centerItems}`}>
          <PageTitle contents="Manage Tags" />
        </Box>
        <HealerTags tags={props.tags} />
      </div>
    );
  });
};

const PageContent = (props) => {
  const classes = useStyles();

  const [cancelFee, setCancelFee] = useState();
  const [appliedDay, setAppliedDay] = useState();

  React.useEffect(() => {
    // This fills the form with your current user data.
    (async () => {
      try {
        const response = await fetch(
          process.env.REACT_APP_API_DOMAIN + '/cancel-fee',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + aToken,
              'Content-Type': 'application/json;charset=utf-8',
            },
          }
        );
        if (!response.ok) {
          throw Error(response.status + ': ' + response.statusText); // error checking, is the data okay?
        } else {
          const data = await response.json(); // transform the data from string into JSON format.
          setCancelFee(data.fee);
          setAppliedDay(data.appliedDay);
        }
      } catch (Error) {
        console.log(Error);
      }
    })();
  }, props.healerID);

  /** Page title "Manage Services" followed by component that renders the "healer services"
   *  and the component that deals with the cancelation fee.
   */
  return (
    <div>
      <CssBaseline />
      <Box className={`${classes.Box} ${globalStyles.centerItems}`}>
        <PageTitle contents="Manage Services" />
      </Box>
      <HealerServices services={props.services} />
      <Box padding="24px">
        <Box className={`${classes.Box} ${globalStyles.centerItems}`}>
          <Typography variant="h6">Your Cancelation Fee</Typography>
        </Box>
        <Formik
          enableReinitialize
          render={(props) => <CancelationFee {...props} />}
          initialValues={{
            fee: cancelFee,
            appliedDay: appliedDay,
          }}
          onSubmit={(data) => {
            (async () => {
              try {
                const response = await fetch(
                  process.env.REACT_APP_API_DOMAIN + '/cancel-fee',
                  {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                      Authorization: 'Bearer ' + aToken,
                      'Content-Type': 'application/json;charset=utf-8',
                    },
                    body: JSON.stringify(data),
                  }
                );
                if (response.status == 200) {
                  alert('fee created'); // sends you to the login page after you make the account
                } else {
                  alert('Need to create a service before create cancel fee.');
                }
              } catch (error) {
                console.log('Fetch API error - post' + error);
              }
            })();
          }}
        />
      </Box>
    </div>
  );
};

/** Main renderer */
function ServicesPage() {
  const classes = useStyles();

  const [services, setServices] = useState([]);
  const [healerID, setHealerId] = useState();
  const [tags, setTags] = useState([]);

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
        console.log(data);
        console.log('data is here');
        setHealerId(data.healerProfileId);
        setTags(data.tags);
      } catch (Error) {
        console.log(Error);
      }
    })();
  }, []);

  // API CALL TO RETRIEVE INFORMATION ABOUT A HEALER'S SERVICES
  // NEED TO TEST TO SEE IF THE USER ID WE USE HERE IS CORRECT
  // SHOULD RETURN A LIST OF SERVICES PROVIDED BY A HEALER

  React.useEffect(() => {
    (async () => {
      try {
        // fetches the user data for this user.
        const response = await fetch(
          process.env.REACT_APP_API_DOMAIN + '/services',
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
        setServices(data);
      } catch (Error) {
        console.log(Error);
      }
    })();
  }, healerID);

  if (services) {
    return (
      <div>
        <Paper className={`${classes.Paper} ${globalStyles.smlPgContainer}`}>
          <PageContent services={services} healerID={healerID} />
        </Paper>
        <Paper>{/*<TagContent tags={tags} />*/}</Paper>
        <Copyright />
      </div>
    );
  } else {
    return <div>Loading...</div>;
  }
}

export default ServicesPage;
