import Media from 'react-media';
import React, { useState } from 'react';
import {
  Grid,
  Paper,
  Button,
  Typography,
  Box,
  CssBaseline,
  makeStyles,
  Card,
  CardContent,
  List,
  ListItem,
  useMediaQuery,
} from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';
import Copyright from './copyright.jsx';
import DefaultButton from './comps/defButton.jsx';
import avatarPic from '../media/avatar.jpg';
import globalStyles from './comps/globalStyling.module.css';
import moment from 'moment-timezone';
//import moment from 'moment';
import 'moment-timezone';
import { useParams } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  button: {
    backgroundColor: theme.palette.button.orange,
    margin: '12px',
    paddingLeft: '24px',
    paddingRight: '24px',
  },

  center: {
    display: 'flex',
    alignItems: 'center',
    height: '110vh',
  },
  paper: {
    marginTop: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  column: {
    float: 'left',
    width: '50%',
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  colItem: {
    float: 'up',
  },
  avatar: {
    borderRadius: '50%',
    width: '120px',
    height: '120px',
  },
  gridItem: {
    marginTop: '8px',
    marginBottom: '8px',
    padding: 0,
  },
  tagContainer: {
    display: 'flex',
    flexDirection: 'row',
    margin: '8px',
    padding: 0,
  },
  tagItem: {
    background: theme.palette.icon.green,
    float: 'left',
    borderRadius: '20px',
    margin: '2px',
    paddingLeft: '4px',
    paddingRight: '4px',
    width: '50px',
    color: '#ffffff',
  },
  locationInfo: {
    margin: '4px',
    marginLeft: '24px',
  },
}));

const ReviewCard = (props) => {
  const classes = useStyles();

  return (
    <Card
      className={`${classes.Card} ${globalStyles.cardPaper}`}
      style={{ marginTop: '20px' }}
    >
      <CardContent display="flex">
        <Grid container spacing={1}>
          <Grid item xs={7}>
            <Typography marginLeft="0" variant="body2">
              {moment
                .tz(props.date, moment.tz.guess())
                .format('MMMM Do @ hh:mm a')}
            </Typography>
          </Grid>
          <Grid item xs={5}>
            <Typography marginLeft="0" variant="body2" align="right">
              {props.serviceName}
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            className={`${classes.Box} ${globalStyles.centerItems}`}
          >
            <Rating
              defaultValue={props.rating}
              size="large"
              readOnly
              spacing={3}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography marginLeft="0" variant="body1">
              {props.description}
            </Typography>
          </Grid>
          {/*<Grid item xs={12}>
            <TagSet float="up" />
          </Grid>*/}
          {/*<Grid item xs={12}>
            <Box float="up">{props.reviewImage}</Box>
          </Grid>*/}
        </Grid>
      </CardContent>
    </Card>
  );
};

// WILL IMPLEMENT TAGS IF TIME

// const TagSet = (props) => {
//   const classes = useStyles();
//   //const { date, serviceName, text, stars, tags, image } = props;

//   return (
//     <Box className={classes.tagContainer}>
//       <Paper className={classes.tagItem} elevation={0}>
//         <Box className={classes.boxCenterItems}>
//           <Typography variant="caption">Loss</Typography>
//         </Box>
//       </Paper>
//       <Paper className={classes.tagItem} elevation={0}>
//         <Box className={classes.boxCenterItems}>
//           <Typography variant="caption">Anger</Typography>
//         </Box>
//       </Paper>
//     </Box>
//   );
// };

const Tag = (props) => {
  const classes = useStyles();

  return (
    <Paper className={`${classes.Box} ${globalStyles.tagItem}`}>
      <Box className={`${classes.Box} ${globalStyles.centerItems}`}>
        <Typography variant="caption">{props.tagName}</Typography>
      </Box>
    </Paper>
  );
};

const BasicHealerInfo = (props) => {
  const classes = useStyles();

  return (
    <Box>
      <Box className={`${classes.Box} ${globalStyles.centerItems}`}>
        <img src={props.photo} className={classes.avatar} />
      </Box>
      <Box className={`${classes.Box} ${globalStyles.centerItems}`}>
        <Typography variant="h4">{props.name}</Typography>
      </Box>
      <Box className={`${classes.Box} ${globalStyles.centerItems}`}>
        <Typography variant="h5">{props.brand}</Typography>
      </Box>
    </Box>
  );
};

const HealerDescription = (props) => {
  const classes = useStyles();
  const { description } = props;

  return (
    <Box>
      <Typography className={classes.gridItem} component="body1">
        {description}
      </Typography>
      {/* <TagSet /> */}
    </Box>
  );
};

const HealerLocationInfo = (props) => {
  const classes = useStyles();

  return (
    <Box>
      <Typography className={classes.locationInfo} variant="body2">
        Address: {props.address}
      </Typography>
      <Typography className={classes.locationInfo} variant="body2">
        City: {props.city}
      </Typography>
      <Typography className={classes.locationInfo} variant="body2">
        Province: {props.province}
      </Typography>
    </Box>
  );
};

const HealerServices = (props) => {
  const classes = useStyles();
  const [services, setServices] = useState([]);

  React.useEffect(() => {
    (async () => {
      try {
        // fetches the user data for this healer.
        const response = await fetch(
          process.env.REACT_APP_API_DOMAIN +
            '/services?healer=' +
            props.healerID,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        if (!response.ok)
          throw Error(response.status + ': ' + response.statusText); // error checking, is the data okay?
        const data = await response.json(); // transform the data from string into JSON format.
        setServices(() => data);
      } catch (Error) {
        console.log(Error);
      }
    })();
  }, []);

  return (
    <List className={`${classes.List} ${globalStyles.list}`}>
      {services.map((service, i) => (
        <ServiceListItem
          index={i}
          serviceName={service.name}
          key={service + i}
          servicePrice={service.price}
          serviceLength={service.timeLength}
          serviceDescription={service.description}
          serviceAvailability={service.isAvailableOnline}
        />
      ))}
    </List>
  );
};

const ServiceListItem = (props) => {
  const classes = useStyles();

  const [showComponent, setShowComponent] = useState(false);

  function handleClick() {
    showComponent ? setShowComponent(false) : setShowComponent(true);
  }

  return (
    <List>
      <ListItem
        className={
          props.index % 2
            ? `${classes.ListItem} ${globalStyles.listEven}`
            : `${classes.ListItem} ${globalStyles.listOdd}`
        }
        onClick={handleClick}
      >
        <Grid container spacing={0}>
          <Grid item xs={6}>
            <Typography variant="body1">{props.serviceName}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography align="right" variant="body1">
              ${props.servicePrice}
            </Typography>
          </Grid>
        </Grid>
      </ListItem>
      {showComponent ? (
        <ServiceListItem_Selected
          serviceName={props.serviceName}
          servicePrice={props.servicePrice}
          serviceLength={props.serviceLength}
          serviceDescription={props.serviceDescription}
          serviceAvailability={props.serviceAvailability}
        />
      ) : null}
    </List>
  );
};

const ServiceListItem_Selected = (props) => {
  const classes = useStyles();

  return (
    <ListItem className={`${classes.ListItem} ${globalStyles.listSelected}`}>
      <Grid container spacing={0}>
        <Grid container spacing={0}>
          <Grid item xs={12}>
            <Typography align="right" variant="body1">
              ${props.servicePrice}
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs={12} className={classes.transparent}>
          <Typography variant="body1">{props.serviceDescription}</Typography>
        </Grid>
        <Grid item xs={12} className={classes.transparent}>
          <Typography variant="body2">
            {props.serviceAvailability ? 'Available Online' : ''}
          </Typography>
        </Grid>
        <Grid item xs={12} className={classes.transparent}>
          <Typography variant="body2">{props.serviceLength} minutes</Typography>
        </Grid>
      </Grid>
    </ListItem>
  );
};

const BookingButton = (props) => {
  const classes = useStyles();
  const aToken = sessionStorage.getItem('token');
  // GO TO BOOK APPOINTMENT PAGE

  return (
    <Box className={`${classes.Box} ${globalStyles.centerItems}`}>
      <DefaultButton
        href={aToken ? '/booking/' + props.healerID : '/login'}
        contents="Book an Appointment"
      />
    </Box>
  );
};

const HealerPage = (props) => {
  const LIMIT_MOBILE = 4;
  const LIMIT_WEB = 8;

  const isMobile = useMediaQuery('500');
  const inititalLimit = isMobile ? LIMIT_MOBILE : LIMIT_WEB;

  const [limit, setLimit] = useState(inititalLimit);
  const showMoreDocuments = () => {
    setLimit(limit + 4);
  };

  const [userName, setName] = React.useState(String);
  const [userDesc, setDesc] = React.useState(String);
  const [userBrand, setBrand] = React.useState(String);
  const [userImage, setImage] = React.useState();

  const [healerAddress, setAddress] = React.useState(String);
  const [healerCity, setCity] = React.useState(String);
  const [healerProvince, setProvince] = React.useState(String);
  // const healerID = window.location.pathname.charAt(
  //   window.location.pathname.length - 1
  // );
  const { id: healerID } = useParams();
  const aToken = sessionStorage.getItem('token');

  React.useEffect(() => {
    (async () => {
      try {
        // fetches the user data for this healer.
        const response = await fetch(
          process.env.REACT_APP_API_DOMAIN + window.location.pathname,
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
          setImage(avatarPic);
        } else {
          setImage(data.photo); // sets the image on the screen as the URL we created
        }
        setName(data.firstName + ' ' + data.lastName);
        setBrand(data.brandName);
        setAddress(data.location.address);
        setCity(data.location.city);
        setProvince(data.location.province);
        setDesc(data.description);
      } catch (Error) {
        console.log(Error);
      }
    })();
  }, []);

  //CALL TO REVIEWS ENDPOINT TO RETRIEVE INFORMATION
  const [reviews, setReviews] = useState([]);

  React.useEffect(() => {
    (async () => {
      try {
        // fetches the user data for this healer.
        const response = await fetch(
          process.env.REACT_APP_API_DOMAIN + '/reviews?healer=' + healerID,
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
        setReviews(() => data);
      } catch (Error) {
        console.log(Error);
      }
    })();
  }, []);

  const classes = useStyles();
  console.log(healerID);

  return (
    <div>
      <Paper className={`${classes.Paper} ${globalStyles.defPgContainer}`}>
        <CssBaseline />
        <Media query="(max-width: 900px)">
          {(matches) =>
            matches ? (
              <div>
                <BasicHealerInfo
                  photo={userImage}
                  name={userName}
                  brand={userBrand}
                />
                <HealerDescription description={userDesc} />
                <HealerServices healerID={healerID} />
                <HealerLocationInfo
                  address={healerAddress}
                  city={healerCity}
                  province={healerProvince}
                />
                <BookingButton healerID={`${healerID}`} />
                <Box className={`${classes.Box} ${globalStyles.centerItems}`}>
                  <Typography variant="h6">Reviews</Typography>
                </Box>
                <Grid container spacing={3}>
                  {reviews.slice(0, limit).map((healerReview, i) => (
                    <Grid
                      item
                      xs={12}
                      className={classes.transparent}
                      key={healerReview + i}
                    >
                      <ReviewCard
                        key={healerReview + i}
                        date={healerReview.updatedAt}
                        description={healerReview.description}
                        photo={healerReview.photo}
                        serviceName={healerReview.serviceName}
                        rating={healerReview.rating}
                      />
                    </Grid>
                  ))}
                </Grid>
              </div>
            ) : (
              <div>
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <BasicHealerInfo
                      photo={userImage}
                      name={userName}
                      brand={userBrand}
                    />
                    <HealerLocationInfo
                      address={healerAddress}
                      city={healerCity}
                      province={healerProvince}
                    />
                    <BookingButton healerID={healerID} />
                  </Grid>
                  <Grid item xs={6}>
                    <HealerDescription description={userDesc} />
                    <HealerServices healerID={healerID} />
                  </Grid>
                </Grid>
                <Box className={`${classes.Box} ${globalStyles.centerItems}`}>
                  <Typography variant="h6">Reviews</Typography>
                </Box>
                <Grid container spacing={3}>
                  {reviews.slice(0, limit).map((healerReview, i) => (
                    <Grid
                      item
                      xs={6}
                      className={classes.transparent}
                      key={healerReview + i}
                    >
                      <ReviewCard
                        key={healerReview + i}
                        date={healerReview.updatedAt}
                        description={healerReview.description}
                        photo={healerReview.photo}
                        serviceName={healerReview.serviceName}
                        rating={healerReview.rating}
                      />
                    </Grid>
                  ))}
                </Grid>
              </div>
            )
          }
        </Media>
      </Paper>
      <Copyright />
    </div>
  );
};
export default HealerPage;
