const express = require('express');
const app = express();
const port = 3000;
//use nanoid to generate ids for users and messages, I believe mongodb also does this automatically
const { nanoid } = require('nanoid');
//jwt to generate authentication tokens
const jwt = require('jsonwebtoken');
//secret also used for authentication
const secret = "Group18";

/* --------Not necessary if you are not using mongodb--------
//mongodb starter code copied and pasted from mongodb website
const MongoClient = require('mongodb').MongoClient;
//                                  don't forget to change the password           and database name             
const uri = "mongodb+srv://rdetzler:kapstone18@group-18-kapstone.kbjox.mongodb.net/db?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});

//mongoose start code from mongoose website
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true, useUnifiedTopology: true});
app.use(express.json());

//set up the model for our users
const User = mongoose.model('User', {
  //make the username a string, set min and max length, make it required, require that it is unique
  username: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 20,
    unique: true,
  },
  //make the displayName a string, make it required, set length
  displayName: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 20,
  },
  //make password a string, make it required, set length
  password: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 20,
  },
  //make about a string, set length
  about: {
    type: String,
    minLength: 1,
    maxLength: 200,
  },
  //make id a num, use nano id to generate an id
  id: {
    type: Number,
    default: () => nanoid(),
  },
  //make the token a string, set the default value as a empty string
  token: {
    type: String,
    default: "",
  },
  //make the picture location a string
  pictureLocation: {
    type: String,
  }
});

//set up the model for messages
const Message = mongoose.model('Message', {
  //id = num, use nano id
    id: {
      type: Number,
      default: () => nanoid(),
    },
    //text = string, set length
    text: {
      type: String,
      maxLength: 200,
      minLength: 1,
  },
  //username = string, set length
    username: {
      type: String,
      minLength: 3,
      maxLength: 20,
    },
    //likes will be an object nested inside a message
    likes: {
      //id = string, generate with nano id
      id: {
        type: String,
        default: () => nanoid(),
      },
      //username = string
      username: {
        type: String,
      },
      //messageId = num
      messageId: {
        type: Number,
      },
    },
});
      ---------Not necessary if you are not using mongodb----------*/
//mock database for testing
let db = {
  users:[
    {pictureLocation:null, username:"ryantest", password: "1234", displayName:"test", id: 1, about:"", token: ""},
    {pictureLocation:null, username:"Johnny", password: "1235", displayName:"Johnny", id: 2, about:"", token: ""},
    {pictureLocation:null, username:"ooss", password: "1236", displayName:"ssss", id: 3, about:"", token: ""},
  ],
  messages:[],
};

//middleware to give access to database, from Peter Mayor demo
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header(
    "Access-Control-Allow-methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  next();
});

//express middleware to format requests into json
app.use(express.json());

//test get request
app.get('/', (req, res) => {
  console.log("get request received")
  res.send('Hello World!')
});

//set up local port
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});

//checkAuth to check for tokens on requests requiring authentication
function checkAuth(req, res, next) {
  try{
    /*request is sent as "bearer token", need to slice out the space
    between bearer and the token to accurately check for the token*/    
    const token = req.headers.authorization?.slice(7) || ''
    //use jwt.verify to verify the token, if token is incorrect this should return false
    let decoded = jwt.verify(token, secret);
    //if decoded === true, use next to continue on to the next function
    if (decoded) {
      next()
      //else send 401 status
    } else {
      res.sendStatus(401)
    };
    //use a catch to send 401 error status and message if any preceding code fails
  } catch(err) {
    res.status(401).send(err.message)
  };
};

/*Everything beyond this point is still very much in development.
Several of the calls function correctly but do not have proper error handling yet,
app.post/users cand be forced to work but is bugged,
and some have not been started yet.*/

//login, still need proper error handling messages, so the user knows why they can't log in
app.post('/auth/login', (req, res) => {
  //destructure the request body
  const {username, password} = req.body;
  //use find to check for a valid username
  const user = db.users.find((u) => {
    return u.username === username
  });
  //check for the correct password and use findIndex to find the user in the database
  if (user.password === password) {
    const index = db.users.findIndex((u) => {
      return u.id === user.id
    });
    //create a token
    const token = jwt.sign({  foo: 'bar' }, secret);
    //give the user a token on the db side
    db.users[index].token = token
    //send token to the client side in the response
    res.status(200).send(token);
  }
  //send 401 if above code fails
  res.status(401);
});

//logout               check for a token       still needs error handling
app.get('/auth/logout', checkAuth, (req, res) => {
  const username = req.body;
  //verify the username
  const user = db.users.find((u) => {
    return u.username === username
  });
  //use findIndex to the the user id
  const index = db.users.findIndex((u) => {
    return u.id === user.id
  });
  //create empty token
  token = "";
  //give the user the empty token
  db.users[index].token = token;
  //send empty token to client side
  res.status(200).send(token);
});

//create new user (this is using mongoose syntax)
app.post('/users', (req, res) => {
  //deconstruct request body
  const {username, displayName, password} = req.body;
  //create new user using mongoose model
  const newUser = new User (req.body);
  //use .save to save a new user to the db and .then to send response
  user.save().then(() => {
    res.json(user)
    //if .save failes, send error
  }).catch((err) => {
    res.status(400).send(err)
  });
  //still need to incorporate a way to give the new user a token
});

app.patch('/users/:username', (req, res) => {
  
});

//get a list of users, asynchronous (also already set up for mongoose)
app.get('/users', async (req, res) => {
  //use .find to find all user
  const users = await User.find({});
  //send users to the client
  res.json(users)
});

//get a user by username, needs error handling
app.get('/users/:username', (req, res) => {
  //use .find to search for the username
  const selectedUser = db.users.find((user) => {
    //verify username in db matches username being requested in the params
    return user.username === req.params.username
  });
  //send the selected user to the client
  res.json(selectedUser)
});

app.get('/users/:username/picture', (req, res) => {

});

app.put('/users/:username/picture', (req, res) => {

});

/*Post a message. Just a skeleton, currently, but does function enough to create a basic message.
Needs modified to also add the username of the user posting the message,
and needs error handling*/
app.post('/messages', checkAuth, (req, res) => {
  //get the message text from the request body and assign an id
  const message = {
    text: req.body.text,
    id: nanoid(),
  };
  //use .push to add to the message db
  db.messages.push(message);
  //send 201 status code and the message body back to the client
  res.status(201).json(message);
});

//get a message by id
app.get('/messages/:messageId', (req, res) => {
  /*use.find to find the message    I ran into an issue with the message id in the db and the message id in params
                                    being different data types (one a string, and one a num)
                                    I used == instead of === as a workaround, but using parseInt() would probably be better*/
  const selectedMessage = db.messages.find((message) => message.id == req.params.messageId);
  //send the message to the client
    res.json(selectedMessage);
});

app.get('/messages}', (req, res) => {

});

app.delete('/messages/:messageId', (req, res) => {

});

app.post('/likes', (req, res) => {

});

app.delete('/likes/:likeId', (req, res) => {

});