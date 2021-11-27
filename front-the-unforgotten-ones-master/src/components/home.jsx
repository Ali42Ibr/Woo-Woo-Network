import React, { useState } from 'react';
import { fade } from '@material-ui/core/styles/colorManipulator';
import FavoriteRoundedIcon from '@material-ui/icons/FavoriteRounded';
import PeopleRoundedIcon from '@material-ui/icons/PeopleRounded';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import * as ReactBootStrap from 'react-bootstrap';
import {
  Grid,
  Paper,
  Button,
  Typography,
  Box,
  CssBaseline,
  makeStyles,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  useMediaQuery,
} from '@material-ui/core';
//import jwt_decode from 'jwt-decode';
import backgroundImage from '../media/background.jpeg';
import globalStyles from './comps/globalStyling.module.css';
import DefaultButton from './comps/defButton';
import Copyright from './copyright.jsx';
import MoreButton from './comps/moreButton';
import PageTitle from './comps/pgTitle';
import SmallClearButton from './comps/smlClearButton';

const useStyles = makeStyles((theme) => ({
  text: {
    fontSize: 12,
    [theme.breakpoints.up('md')]: {
      fontSize: 20,
    },
  },
  mainFeaturedPost: {
    position: 'relative',
    //marginBottom: theme.spacing(4),
    backgroundImage: 'url(https://source.unsplash.com/random)',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    height: 700,
    '@media (max-width: 780px)': {
      height: '100%',
    },
  },
  mainFeaturedPostContent: {
    //position: 'relative',
    //padding: theme.spacing(3),
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(6),
      paddingRight: 0,
    },
  },
  root: {
    display: 'flex',
    overflow: 'hidden',
  },
  container: {
    margin: theme.spacing(12, 0),
    display: 'flex',
    position: 'relative',
    padding: theme.spacing(0),
  },
  item: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(0),
  },
  image: {
    height: 55,
  },
  title: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),
  },

  flavorImage: {
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.25)',
    position: 'relative',
    backgroundImage: 'url(https://source.unsplash.com/random)',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    height: 700,
    padding: theme.spacing(4, 0),
  },
  flavorContents: {
    width: '700px',
    '@media (max-width: 700px)': {
      width: '100%',
    },
    backgroundColor: fade('#ffffff', 0.5),
    margin: 'auto',
    boxShadow: '0 3px 9px rgba(0, 0, 0, 0.1)',
    padding: theme.spacing(4, 2),
    marginTop: theme.spacing(20),
    display: 'flex',
    flexDirection: 'column',
  },
  healersButton: {
    backgroundColor: '#cefa3e',
    color: '#343434',
    '&:hover': {
      backgroundColor: '#faeb3e',
    },
    padding: theme.spacing(1, 8),
  },
  buttonContainer: {
    position: 'absolute',
    bottom: '48px',
    width: '100%',
  },
  centerVertical: {
    position: 'relative',
  },
  healerImage: {
    borderRadius: '50%',
    marginRight: theme.spacing(2),
    width: '64px',
    minWidth: '64px',
    height: '64px',
  },
}));

const TagSet = (props) => {
  const classes = useStyles();

  return (
    <Box className={`${classes.Box} ${globalStyles.tagContainer}`}>
      <Tag tagName="Loss" />
      <Tag tagName="Anger" />
    </Box>
  );
};

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

/** 
 This is the home page. It holds the description of the site, some tasteful images to spice it up a bit,
 and a list of all the healers who have made accounts.
 Ideally I'd like to randomize the order of the healers on this page so it's not the first few who signed up every time.
 But that will only be necessary once there are a lot more signed up.
 alternately, use some more sophisticated way of searching for healers, like a search function or something.
 This way works as a showcase though.
 Maybe there could be a more detailed paragraph describing the site here too.
*/
//searchLocationUser is for returning user locations, search are for the searching, searchTag is for the filtering
function Home() {
  const classes = useStyles();
  const [healers, setHealers] = useState([]);
  const [searchLocationUser, setSearchLocationUser] = useState([]);
  const [search, setSearch] = useState('');
  const [searchTag, setSearchTag] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const LIMIT_MOBILE = 4;
  const LIMIT_WEB = 8;

  const isMobile = useMediaQuery('500');
  const inititalLimit = isMobile ? LIMIT_MOBILE : LIMIT_WEB;

  const [limit, setLimit] = useState(inititalLimit);
  const showMoreDocuments = () => {
    setLimit(limit + 4);
  };

  function Healer({
    // this doohickey holds healer data. This is the object we plop the data into.
    healerName,
    healerDesc,
    userid,
    healerImage,
    healerBrand,
  }) {
    const limit = 60;
    var healerDescriptionToShow = healerDesc;
    if (healerDesc == null) {
      healerDescriptionToShow =
        'Check the profile for more information about this healer.';
    } else if (healerDesc.length > limit) {
      healerDescriptionToShow = healerDesc.substring(0, limit) + '...';
    }

    if (healerBrand == null) {
      healerBrand = 'Brand Name';
    }

    return (
      <Grid item xs={12} sm={6}>
        <Card className={`${classes.Card} ${globalStyles.cardPaper}`}>
          <CardActionArea>
            <CardContent>
              <Box display="flex">
                <CardMedia
                  className={classes.healerImage}
                  image={healerImage}
                  title="Healer Showcase Card"
                />
                <Box display="flex" flexDirection="column" textAlign="left">
                  <Typography variant="h6">{healerName}</Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    {healerBrand}
                  </Typography>
                </Box>
              </Box>
              <Box textAlign="left" marginTop="8px">
                <Typography variant="body2" color="textSecondary" component="p">
                  {healerDescriptionToShow}
                </Typography>
                {/*<TagSet />*/}
              </Box>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <SmallClearButton
              href={'/healers/' + userid}
              contents="Learn More"
            />
            <SmallClearButton
              href="https://www.facebook.com/"
              contents="Share"
            />
          </CardActions>
        </Card>
      </Grid>
    );
  }

  React.useEffect(() => {
    // Fetches the array of healers to show on screen.
    (async () => {
      try {
        const response = await fetch(
          process.env.REACT_APP_API_DOMAIN + '/healers'
        );
        if (!response.ok)
          throw Error(response.status + ': ' + response.statusText); // error checking, is the data okay?
        const data = await response.json(); // transform the data from string into JSON format.
        setHealers(() => data);
      } catch (Error) {
        console.log(Error);
      }
    })();

    //posts to backend with user info, gets back a healer list based on location
    (async () => {
      try {
        const response = await fetch(
          process.env.REACT_APP_API_DOMAIN + '/healers/healerSearch',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: 1,
              userLocation: '3075 Vint Road Kelowna',
            }),
          }
        );
        const data = await response.json().then((res) => {
          console.log(res);
          setSearchLocationUser(res);
        });
        setIsLoading(true);
      } catch (Error) {
        console.log(Error);
      }
    })();
  }, []);

  //filters based on tags
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
    } else {
      console.log('Weird else');
    }
  }

  //setting state for searching
  function onChangeSearch(e) {
    setSearch(e.target.value);
  }

  function fullSearchFunction(props) {
    clickSearch(props);
  }

  let filteredNames = [];

  const searchThis = search;
  try {
    filteredNames = searchLocationUser.filter((person) => {
      return (
        person.firstName.toLowerCase().indexOf(searchThis.toLowerCase()) !== -1
      );
    });
  } catch (err) {
    console.log(err);
  }
  return (
    <div style={{ textAlign: 'center' }}>
      <CssBaseline />
      <a id="landing"></a>
      <Box
        className={classes.flavorImage}
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        {/* Increase the priority of the hero background image */}
        {
          <img
            style={{ display: 'none' }}
            src={backgroundImage}
            alt="alt image line 54"
          />
        }
        {/*These three buttons are for filtering, they change color when they are already chosen*/}
        <p>Click a tag to add or remove it to search filter</p>
        <button onClick={() => clickSearch('Clear')}>Clear</button>
        <button
          style={{ color: searchTag.includes('Pregnancy') ? 'green' : 'black' }}
          onClick={() => fullSearchFunction('Pregnancy')}
        >
          Pregnancy
        </button>
        <button
          style={{ color: searchTag.includes('Therapy') ? 'green' : 'black' }}
          onClick={() => fullSearchFunction('Therapy')}
        >
          Therapy
        </button>
        <button
          style={{ color: searchTag.includes('Marital') ? 'green' : 'black' }}
          onClick={() => fullSearchFunction('Marital')}
        >
          Marital
        </button>
        {/*search for a user*/}
        <input
          type="text"
          placeHolder="search"
          onChange={onChangeSearch}
          onClick={() => {
            if (!isSearching) {
              setIsSearching(true);
            } else {
              setIsSearching(false);
            }
          }}
        />
        {isSearching && (
          <button
            onClick={() => {
              if (!isSearching) {
                setIsSearching(true);
              } else {
                setIsSearching(false);
              }
            }}
          >
            Close search
          </button>
        )}
        {/*filtering users (for tags and names)*/}
        {isSearching &&
          filteredNames.map((val, key) => {
            console.log(val.tags[0].name);
            if (searchTag.includes(val.tags[0].name)) {
              return (
                <div className="user" key={key}>
                  <a href={'/healers/' + val.id}>
                    {val.firstName +
                      '   ' +
                      val.distance +
                      ' km /' +
                      val.tags[0].name}
                  </a>
                </div>
              );
            } else if (searchTag.length == 0) {
              return (
                <div className="user" key={key}>
                  <a href={'/healers/' + val.id}>
                    {val.firstName + '   ' + val.distance + ' km'}
                  </a>
                </div>
              );
            }
          })}
        {isLoading ? <p></p> : <ReactBootStrap.Spinner animation="border" />}
        <Paper className={classes.flavorContents}>
          <Typography variant="h3" gutterBottom color="black">
            Global Healing Network
          </Typography>
          <Typography variant="h5" color="inherit" paragraph>
            We connect clients to healers worldwide
          </Typography>
        </Paper>

        <Box className={classes.buttonContainer}>
          <Button
            color="primary"
            size="large"
            href="#healers_section"
            className={classes.healersButton}
          >
            Browse our Healers
          </Button>
        </Box>
      </Box>
      {/* WANT TO SIGN UP SECTION */}
      <Grid container className={classes.container}>
        <Grid item xs={2}></Grid>
        <Grid item xs={3}>
          <Box className={classes.centerVertical}>
            <div className={classes.item}>
              <PeopleRoundedIcon />
              <Typography variant="h5" className={classes.text}>
                Want to make an appointment with one of our Healers?
              </Typography>
            </div>
          </Box>
        </Grid>
        <Grid item xs={2}>
          <Box className={classes.centerVertical} top="20px">
            <div className={classes.item}>
              <Typography variant="h5" color="inherit">
                or
              </Typography>
            </div>
          </Box>
        </Grid>
        <Grid item xs={3}>
          <Box className={classes.centerVertical} top="0px">
            <div className={classes.item}>
              <FavoriteRoundedIcon />
              <Typography variant="h5" className={classes.text}>
                Are you a healer?
              </Typography>
            </div>
          </Box>
        </Grid>
        <Grid item xs={2}></Grid>
        <Grid item xs={12}>
          <DefaultButton href="/signup" contents="Sign Up Here" />
        </Grid>
      </Grid>
      {/* healers info */}
      <Paper className={`${classes.Paper} ${globalStyles.defPgContainer}`}>
        <a id="healers_section">
          <PageTitle contents="Our Healers" />
        </a>
        {/* <Container className={classes.container}> */}
        <Grid container spacing={3}>
          {/* MAPPING             */}
          {healers.slice(0, limit).map((healerName, i) => (
            <Healer
              healerName={healerName.firstName + ' ' + healerName.lastName}
              healerDesc={healerName.description}
              key={healerName + i}
              userid={healerName.id}
              healerImage={healerName.photo}
            />
          ))}
          <Grid item xs={12}>
            <Grid container>
              <Grid item xs={3}></Grid>
              <Grid item xs={6}>
                <Paper className={`${classes.Paper} ${globalStyles.cardPaper}`}>
                  <MoreButton onClick={showMoreDocuments} />
                </Paper>
              </Grid>
              <Grid item xs={3}></Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
      <Copyright />
    </div>
  );
}
export default Home;
