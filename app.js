const express = require('express');
const app = express();
const port = 3000;
const { nanoid } = require('nanoid');
const jwt = require('jsonwebtoken');
const secret = "Group18";

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://detzlerryan@gmail.com:kapstone18@group-18-kapstone.kbjox.mongodb.net/db?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true, useUnifiedTopology: true});
app.use(express.json());

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

let db = {
  users:[
    {pictureLocation:null, username:"ryantest", password: "1234", displayName:"test", id: "1", about:"", token: ""},
    {pictureLocation:null, username:"Johnny", password: "1235", displayName:"Johnny", id: "2", about:"", token: ""},
    {pictureLocation:null, username:"ooss", password: "1236", displayName:"ssss", id: "3", about:"", token: ""},
  ],
  messages:[],
};

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
  next()
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