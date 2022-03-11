import publicHealerProfileHelper from './public-healer-profile-helper';
import axios from 'axios';
import vincenty from 'node-vincenty';
import dotenv from 'dotenv';

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
    console.log("hey!");
    console.log(healerList);
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

const getHealerLocationList = async (req, res, next) => {

  //initializing position stack api
  dotenv.config();

  let params = {
    access_key: process.env.POSITIONSTACK,
    query: ''
  }
    // limit and start is for pagination purpose
    //regular healer list
    const { limit, start } = req.query;
    const healerList = await publicHealerProfileHelper.getHealerList(
      limit,
      start
    );
    //our user location
    const myLoc = req.body.userLocation;
    params.query = myLoc;

    const getMyCoordinates = async (query) => {
     params.query = query;
      try{
      var resp = await axios.get('http://api.positionstack.com/v1/forward', {params})
      } catch(e) {
        console.log(e);
      }
     console.log("hilol");
     console.log(resp);
     if (resp.status == 200){
      const myLat = (resp.data.data[0].latitude);
      const myLong = (resp.data.data[0].longitude);
      return [myLat,myLong];
     } else {
       console.log(resp);
       return null;
     }
    }

    const myLocationArray = (await getMyCoordinates(myLoc));

    if (myLocationArray == null){
      // if can't get location, don't return it
      console.log(123);
      console.log(healerList);
      res.status(200).json(healerList);
    } else {
    const myLat = myLocationArray[0];
    const myLong = myLocationArray[1];
    console.log("Final",myLat,myLong)

    let userAndDistance = [];

    console.log('healerList');
    console.log(healerList);

    var numUsers = healerList.length;

    
    for (let i = 1; i < numUsers+1; i++){

      const healerProfile = await publicHealerProfileHelper.getHealerProfile(i);

      //my location

      const healerLocationString = (healerProfile.location.address + " " + healerProfile.location.city+ " " +healerProfile.location.province+ " " + healerProfile.location.country+ " " +
      healerProfile.location.postalCode );

      
      console.log((healerProfile.location.address));

      let otherCoordinates = ["1","2"];

      while (!(otherCoordinates[0]+otherCoordinates[0] == otherCoordinates[0]*2) && !(otherCoordinates[1]+otherCoordinates[1] == otherCoordinates[1]*2)){
        otherCoordinates = await getMyCoordinates(healerLocationString);
        console.log(otherCoordinates);
        console.log("Inside while");
      }
      userAndDistance.push({distance:(Math.abs(vincenty.distVincenty(myLat, myLong, otherCoordinates[0], otherCoordinates[1]).distance)),id:i});

    }
    console.log(userAndDistance);
    console.log(123);


    let otherUsers = userAndDistance.sort(function(a, b) {
      return a.distance - b.distance;
    }); // Sort youngest fi



    let newHealerList = [];

    try{
    console.log(otherUsers[1].id)
    console.log(healerList[1].id)
    } catch (e){
      otherUsers = userAndDistance;
    }
    
    for (let i = 0; i < numUsers; i++){
      for (let j = 0; j < numUsers; j++){
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
    
  }



};

export default {
  getPublicHealerList,
  getPublicHealerProfile,
  getHealerLocationList
};
