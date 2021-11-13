import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import vincenty from 'node-vincenty';
import axios from 'axios';



const params = {
  access_key: '5af926703add4889573373062dc15bfb',
  query: '155 Hollywood Rd N Kelowna BC Canada V1X 6B4'
}

axios.get('http://api.positionstack.com/v1/forward', {params})
  .then(response => {
    console.log(response.data.data[0].latitude);
    console.log(response.data.data[0].longitude);
  }).catch(error => {
    console.log(error);
  });

  console.log(params.query)


console.log( Math.abs(vincenty.distVincenty(30.5, -100.6, 31.7, -101.8).distance) );

const users = [
  {
    "id":"0",
    "name":"ali",
    "lat":"100",
    "long":"200"
  },
  {
    "id":"1",
    "name":"boody",
    "lat":"500",
    "long":"600"
  },
  {
    "id":"2",
    "name":"koushy",
    "lat":"700",
    "long":"100"
  }
]


//console.log( vincenty.distVincenty(49.887774, -119.486984, 49.884089, -119.442701) );

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


let user = [];
let otherUsers = [];

app.post('/api/login', (req, res) => {

  let currentUser = (req.body.post);

  for (let i = 0; i < users.length; i++){
    if (users[i].name == currentUser){

      if (req.cookies.username != null){
        console.log("already have a cookie");
        res.send('You already have a cookie');
      } else {
      res.cookie("username",currentUser);
      res.send('Cookie have been saved successfully');
      console.log("Set the cookies")
      }
    }
  }

});

app.post('/api/logout', (req, res) => {
  //show the saved cookies
  console.log("Log out attempt")
  res.clearCookie("username");
  res.send('Cookie has been deleted successfully');
});



app.post('/api/world', (req, res) => {

  let user = '';

  for (let i =0; i < users.length; i++){
    if (req.cookies.username == users[i].name){
      user = users[i];
    }
  }

  console.log(user);

  const mainUser = (Number(user.lat) + Number(user.long));



  let otherUsers = [];

  let mainArray = {"users":""};

  for (let i = 0; i < users.length; i++) {
    if (req.cookies.username != users[i].name){
      otherUsers.push(
        {"name":users[i].name, "location":(Math.pow(Number(users[i].lat) + Number(users[i].long) - mainUser, 2))}
      );
    }
  } 

  console.log(otherUsers);

  mainArray.users = otherUsers;

  console.log(mainArray);

  console.log(req.cookies.username)




  otherUsers = otherUsers.sort(function(a, b) {
    return a.location - b.location;
  }); // Sort youngest fi





  res.json(mainArray);



});

app.listen(port, () => console.log(`Listening on port ${port}`));
