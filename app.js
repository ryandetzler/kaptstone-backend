const express = require('express');
const app = express();
const port = 3000;
const { nanoid } = require('nanoid');
const jwt = require('jsonwebtoken');
const secret = "Group18";
//const mongoose = require('mongoose');
//const MongoClient = require('mongodb').MongoClient;

//const Schema = mongoose.Schema;

// const uri = "mongodb+srv://rdetzler:Goaway88@group-18-kapstone.kbjox.mongodb.net/kapstonebackend?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

// mongoose.connect('localhost:3000', {useNewUrlParser: true, useUnifiedTopology: true});
// app.use(express.json());

// const userSchema = new Schema({
//   username: {
//     type: String,
//     required: true,
//     minLength: 3,
//     maxLength: 20,
//   },
//   displayName: {
//     type: String,
//     required: true,
//     minLength: 3,
//     maxLength: 20,
//   },
//   password: {
//     type: String,
//     required: true,
//     minLength: 3,
//     maxLength: 20,
//   },
//   about: {
//     type: String,
//     minLength: 1,
//     maxLength: 200,
//   },
//   id: {
//     type: String,
//     default: () => nanoid()
//   },
// });

// const messageSchema = new Schema({
//   id: {
//     type: String,
//     default: () => nanoid()
//   },
//   text: {
//     type: String,
//     maxLength: 200,
//     minLength: 1,
//   },
//   username: {
//     type: String,
//     minLength: 3,
//     maxLength: 20,
//   },
//   likes: {
//     type: Number,
//   },
// });

let db = {
  users:[
    {pictureLocation:null, username:"ryantest", password: "1234", displayName:"test", about:"", token: ""},
    {pictureLocation:null, username:"Johnny", password: "1235", displayName:"Johnny", about:"", token: ""},
    {pictureLocation:null, username:"ooss", password: "1236", displayName:"ssss", about:"", token: ""},
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
  const newUser = {
    username: username,
    displayName: displayName,
    password: password,
  };
  const user = db.users.find((u) => {
    if(u.username === username) {
      res.status(400).send('username already taken')
    } else {
      db.users.push(newUser)
    };
  });
  res.status(201)
});

app.patch('/users/:username', (req, res) => {
  
});

app.get('/users', (req, res) => {

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