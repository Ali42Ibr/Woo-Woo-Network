import publicHealerProfileHelper from './public-healer-profile-helper';
import axios from 'axios';
import vincenty from 'node-vincenty';

/**
 * Get a list of public healer profile
 * @note need to add pagination later on
 */
const getPublicHealerList = async (req, res, next) => {
  try {
    // limit and start is for pagination purpose
    const { limit, start } = req.query;
    const healerList = await publicHealerProfileHelper.getHealerList(
      limit,
      start
    );
    res.status(200).json(healerList);
  } catch (err) {
    next(err);
  }
};

/**
 * Get a healer profile based on healer profile id
 */
const getPublicHealerProfile = async (req, res, next) => {
  try {
    // const healerList = db.User.findAll({
    //     include: { model: db.HealerProfile, as: 'account'}
    // });
    const { healerProfileId } = req.params;
    const healerProfile = await publicHealerProfileHelper.getHealerProfile(
      healerProfileId
    );
    // later on will add review and services
    res.status(200).json(healerProfile);
  } catch (err) {
    next(err);
  }
};

//test function, trying to recieve main user information (location) and return a list of healers based on proximity

const getOtherHealerList = async (req, res, next) => {


  //initializing position stack api

  let params = {
    access_key: 'af0ace1cd4322f5ccc0203a3ce2c3a11',
    query: ''
  }
  


  try {
    // limit and start is for pagination purpose

    //regular healer list
    const { limit, start } = req.query;
    const healerList = await publicHealerProfileHelper.getHealerList(
      limit,
      start
    );

    let locations = [];


    //our user location
    const myLoc = req.body.userLocation;
    params.query = myLoc;


    const getMyCoordinates = async (query) => {
     params.query = query;
     const resp = await axios.get('http://api.positionstack.com/v1/forward', {params})
     const myLat = (resp.data.data[0].latitude);
     const myLong = (resp.data.data[0].longitude);

      return [myLat,myLong];

    }

    const myLocationArray = (await getMyCoordinates(myLoc));

    const myLat = myLocationArray[0];
    const myLong = myLocationArray[1];

    console.log("Final",myLat,myLong)

    let userAndDistance = [];

    for (let i = 1; i < 11; i++){

      const healerProfile = await publicHealerProfileHelper.getHealerProfile(i);

      //my location

      const healerLocationString = (healerProfile.location.address + " " + healerProfile.location.city+ " " +healerProfile.location.province+ " " + healerProfile.location.country+ " " +
      healerProfile.location.postalCode );

      let lat = 0;
      let long = 0;


      
      console.log((healerProfile.location.address));

      
      const otherCoordinates = await getMyCoordinates(healerLocationString);

      userAndDistance.push({distance:(Math.abs(vincenty.distVincenty(myLat, myLong, otherCoordinates[0], otherCoordinates[1]).distance)),id:i});


    }
    console.log(userAndDistance);
    console.log(123);


    let otherUsers = userAndDistance.sort(function(a, b) {
      return a.distance - b.distance;
    }); // Sort youngest fi



    let newHealerList = [];

    console.log(otherUsers[1].id)
    console.log(healerList[1].id)

    
    for (let i = 0; i < 10; i++){
      for (let j = 0; j < 10; j++){
      if (otherUsers[i].id == healerList[j].id){
        healerList[j].distance = (otherUsers[i].distance/1000).toFixed(2);
        newHealerList.push(healerList[j]);
      }
    }
    }

    console.log(otherUsers);
    console.log(newHealerList);
    console.log("x123");



    res.status(200).json(newHealerList);
    console.log("My User: " + req.body.userId);
    console.log("My User Location: " + req.body.userLocation);






  } catch (err) {
    next(err);
  }
};

export default {
  getPublicHealerList,
  getPublicHealerProfile,
  getOtherHealerList
};
