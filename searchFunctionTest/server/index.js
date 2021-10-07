import express from 'express';
import bodyParser from 'body-parser';



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

app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
});

let user = [];
let otherUsers = [];

app.post('/api/world', (req, res) => {

  console.log(users[0]);

  user = users[req.body.post];

  const mainUser = (Number(user.lat) + Number(user.long));

  let otherUsers = [];



  for (let i = 0; i < users.length; i++) {
    if (user.id != i){
      otherUsers.push(
        {"id":[i], "location":(Math.pow(Number(users[i].lat) + Number(users[i].long) - mainUser, 2))}
      );
    }
  } 



  otherUsers = otherUsers.sort(function(a, b) {
    return a.location - b.location;
  }); // Sort youngest fi

  let others = `You are user:${user.name} Other users`;

  for (let i = 0; i < otherUsers.length; i++) {
     others = others + `Name: ${users[otherUsers[i].id].name} Location from you: ${otherUsers[i].location/10000} km`

  }


  res.send(
   others 
  );


});

app.listen(port, () => console.log(`Listening on port ${port}`));
