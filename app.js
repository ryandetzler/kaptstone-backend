const express = require('express');
const app = express();
const port = 3000;
const jwt = require('jsonwebtoken');
const secret = "Group18";

//mongodb starter code, copied and pasted from their site
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://rdetzler:kapstone18@group-18-kapstone.kbjox.mongodb.net/db?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});

//mongoose start from their site
const mongoose = require('mongoose');
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});

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
  token: {
    type: String,
    default: "",
  },
  pictureLocation: {
    type: String,
    defaut: "",
  },
  friends: {
    username: {
      type: String,
    },
  },
});

const Message = mongoose.model('Message', {
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
    like: {
      username: {
        type: String,
        default: []
      },
      messageId: {
        type: Number
      },
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

app.post('/auth/login', async (req, res) => {
  const {username, password} = req.body;
  const user = await User.findOne({ username }).exec();

  if (!user) {
    res.status(400);
    };

  if (user.password === password) {
    const token = jwt.sign({  foo: 'bar' }, secret);
    const updatedUser = await User.updateOne({ username }, { token } );

    res.send(updatedUser);
  }
  res.status(401)
});

app.get('/auth/logout', checkAuth, async (req, res) => {
  const username = req.body;
  
  const token = "";
  const updatedUser = await User.updateOne({ username }, { token });

  res.status(200).send(updatedUser)
  });

app.post('/users', (req, res) => {
  const user = new User(req.body);
  user.save().then(() => {
    res.json(user)
  }).catch((err) => {
    res.status(400).send(err)
  });
});

app.patch('/users/:username', async (req, res) => {
  const username = req.params.username;
  const update = req.body;
  console.log(update)

  const user = await User.findOne({ username }).exec();
  const updatedUser = await User.findOneAndUpdate({ user }, update, { new: true });
  res.status(201).send(updatedUser);
});

app.get('/users', async (req, res) => {
  const users = await User.find({});
  res.json(users)
});

app.get('/users/:username', async (req, res) => {
  const username = req.params.username;
  const user = await User.findOne({ username }).exec();

  res.json(user)
});

app.get('/users/:username/picture', (req, res) => {

});

//  --------------in progress----------------
app.put('/users/:username/picture', async (req, res) => {
  const username = req.params.username;
  picture = req.body;
  console.log(picture);

  const user = await User.findOne({ username }).exec();
  const updatedUser = await User.findOneAndUpdate({ user }, picture, {new: true});
  res.status(201).send(updatedUser);
});

app.post('/messages', (req, res) => {
  const message = new Message(req.body)
  message.save().then(() => {
    res.json(message)
  }).catch((err) => {
    res.status(400).send(err)
  });
});

app.get('/messages', async (req, res) => {
  const messages = await Message.find({});
  res.json(messages)
});

app.get('/messages/:messageId', async (req, res) => {
  const messageId = req.params.messageId;
  const message = await Message.findById(messageId).exec();

  res.json(message);
});

app.delete('/messages/:messageId', async (req, res) => {
  try {
    const messageId = Mongoose.Types.ObjectId(req.params.messageId);
    Message.findByIdAndDelete(messageId);

    res.status(200)
  } catch (err){
    res.status(400).send(err)
  };
});

app.post('/likes', (req, res) => {
 
});

app.delete('/likes/:likeId', (req, res) => {

});