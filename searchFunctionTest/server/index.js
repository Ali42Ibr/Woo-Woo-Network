import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';



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


const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


let user = [];
let otherUsers = [];

app.post('/api/login', (req, res) => {

  res.cookie("username","ali");
  res.send('Cookie have been saved successfully');
});

app.get('/api/logout', (req, res) => {
  //show the saved cookies
  res.clearCookie("username");
  res.send('Cookie has been deleted successfully');
});



app.post('/api/world', (req, res) => {


  user = users[req.body.post];

  const mainUser = (Number(user.lat) + Number(user.long));

  let otherUsers = [];

  let mainArray = {"users":"0"};



  for (let i = 0; i < users.length; i++) {
    if (user.id != i){
      otherUsers.push(
        {"name":users[i].name, "location":(Math.pow(Number(users[i].lat) + Number(users[i].long) - mainUser, 2))}
      );
    }
  } 

  mainArray.users = otherUsers;

  console.log(mainArray);




  otherUsers = otherUsers.sort(function(a, b) {
    return a.location - b.location;
  }); // Sort youngest fi





  res.json(mainArray);



});

app.listen(port, () => console.log(`Listening on port ${port}`));
