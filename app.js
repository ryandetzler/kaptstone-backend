const express = require('express');
const app = express();
const port = 3000;
const { nanoid } = require('nanoid');
const jwt = require('jsonwebtoken');
const secret = "Group18";

//mongodb starter code, copied and pasted from their site
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://detzlerryan@gmail.com:kapstone18@group-18-kapstone.kbjox.mongodb.net/db?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});

//mongoose start from their site
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true, useUnifiedTopology: true});
app.use(express.json());

//set up models for user and message using mongoose
const User = mongoose.model('User', {
  username: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 20,
    unique: true,
  },
  displayName: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 20,
  },
  password: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 20,
  },
  about: {
    type: String,
    minLength: 1,
    maxLength: 200,
  },
  id: {
    type: String,
    default: () => nanoid(),
  },
  token: {
    type: String,
    default: "",
  },
});

const Message = mongoose.model('Message', {
    id: {
      type: String,
      default: () => nanoid()
    },
    text: {
      type: String,
      maxLength: 200,
      minLength: 1,
  },
    username: {
      type: String,
      minLength: 3,
      maxLength: 20,
    },
    likes: {
      type: Number,
    },
});

//middleware from Peter Mayor demo
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

app.use(express.json());

app.get('/', (req, res) => {
  console.log("get request received")
  res.send('Hello World!')
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});

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

app.post('/auth/login', (req, res) => {
  const {username, password} = req.body;
  const user = db.users.find((u) => {
    return u.username === username
  });
  if (user.password === password) {
    const index = db.users.findIndex((u) => {
      return u.id === user.id
    });
    const token = jwt.sign({  foo: 'bar' }, secret);
    db.users[index].token = token

    res.send(token);
  }
  res.status(401);
});

app.get('/auth/logout', (req, res) => {
  const username = req.body;
  const user = db.users.find((u) => {
    return u.username === username
  });
  const index = db.users.findIndex((u) => {
    return u.id === user.id
  });
  db.users[index].token = "";
  res.send(token);
});

app.post('/users', (req, res) => {
  const {username, displayName, password} = req.body;
  const newUser = new User (req.body);
  user.save().then(() => {
    res.json(user)
  }).catch((err) => {
    res.status(400).send(err)
  });
});

app.patch('/users/:username', (req, res) => {
  
});

app.get('/users', async (req, res) => {
  const users = await User.find({});
  res.json(users)
});

app.get('/users/:username', (req, res) => {
  const selectedUser = db.users.find((user) => {
    return user.username === req.params.username
  });
  res.json(selectedUser)
});

app.get('/users/:username/picture', (req, res) => {

});

app.put('/users/:username/picture', (req, res) => {

});

app.post('/messages', (req, res) => {
  const message = {
    text: req.body.text,
    id: nanoid(),
  };
  db.messages.push(message);
  res.status(201).json(message);
});

app.get('/messages/:messageId', (req, res) => {
  const selectedMessage = db.messages.find((message) => message.id == req.params.messageId);
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