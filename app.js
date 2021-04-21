const express = require('express');
const app = express();
const port = 3000;
const jwt = require('jsonwebtoken');
const secret = "Group18";
const fs = require('fs');
const path = require('path');

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
    data: Buffer,
    type: String,
    defaut: "",
  },
  friends: {
    type: Array,
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
      type: Array,
      of: Object,
    },
});

//middleware from Peter Mayor demo
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header(
    "Access-Control-Allow-methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  next();
});
app.use(express.json());
// const multer = require('multer');
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, file.fieldname + '-' + Date.now())
//   }
// });
// const upload = multer({ storage: storage });
// app.set('view engine', 'ejs');

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
    let token = jwt.sign({  foo: 'bar' }, secret);
    //const updatedUser = await User.findOneAndUpdate({ username }, { token } ).exec();
    user.token = token;
    user.save();
    res.status(200).send(user);
    token = "";
  }
  res.status(401)
  token = "";
});

app.get('/auth/logout', checkAuth, async (req, res) => {
  const username = req.body;
  const token = "";
  try{
    const updatedUser = await User.updateOne({ username }, { token });
    res.status(200).send(updatedUser)
  } catch(err){
    res.status(401).send(err.message)
  }
  });

app.post('/users', async (req, res) => {
  const user = new User(req.body);
  let token = jwt.sign({  foo: 'bar' }, secret);
  try {
    const newUser = await User.create( user );
    newUser.token = token;
    newUser.save();
    res.status(201).send(newUser)
    token = "";
  }catch (err) {
    res.status(400).send(err.message)
  };
});

app.patch('/users/:username', async (req, res) => {
  const username = req.params.username;
  const update = req.body;
  console.log(update)
  try{
    const user = await User.findOne({ username }).exec();
    console.log(user)
    user.about = update.about;
    user.save()
    console.log(user)
    res.status(201).send(user);
  }catch (err) {
    res.status(400).send(err.message)
  }
  });

app.get('/users', async (req, res) => {
  try{
    const users = await User.find({});
    res.status(200).send(users)
  } catch (err) {
    res.status(400).send(err.message)
  };
});

app.get('/users/:username', async (req, res) => {
  const username = req.params.username;
  try{
    const user = await User.findOne({ username }).exec();

    res.status(200).send(user)
  }catch (err) {
    res.status(400).send(err.message)
  };
});

app.get('/friends/:username', async (req, res) => {
  const username = req.params.username;
  try{
    const user = await User.findOne({ username }).exec();
    const friendsList = user.friends;
    res.send(friendsList);
  } catch(err){
    res.status(400).send(err.message)
  }
})

app.post('/friends/:username', async (req, res) => {
  const username = req.params.username;
  try{
    const user = await User.findOne({ username }).exec();
    const newFriend = req.body.friend
    user.friends.push(newFriend)
    user.save()
    res.status(201).send(user)
  } catch(err){
    res.status(400).send(err.message)
  }
})

app.delete('/friends/:username', async (req, res) => {
  const username = req.params.username;
  const friend = req.body.friend;
  try{
    const user = await User.findOne({ username });
    const removedFriend = user.friends.find(target => target.friend == friend);
    await user.friends.pull(removedFriend);
    user.save()
    res.status(200).send(user)
  } catch(err){
    res.status(400).send(err.message)
  }
})
// app.get('/users/:username/picture', async (req, res) => {
//   const username = req.params.username;
//   const user = await User.findOne({ username }).exec();
//   const picture = user.pictureLocation;
//   res.send(picture);
// });

// //  --------------in progress----------------
// app.put('/users/:username/picture', upload.single('image'), async (req, res) => {
//   const name = req.params.username;
//   const picture = {
//     username: name,
//     img:{
//       data: fs.readFileSync(path.join(__dirname + '/uploads/'+req.file.filename)),
//       contentType: 'image/png'
//     }
//   }
//   console.log(picture)
//   const user = await User.findOne({ username }).exec();
//   user.pictureLocation = picture;
//   user.save()
//   res.status(201).send(user);
// });

app.post('/messages', (req, res) => {
  try{
    const message = new Message(req.body)
    message.save().then(() => {
      res.json(message)
    }).catch((err) => {
      res.status(400).send(err)
    });
  } catch(err){
    res.status(40).send(err.message)
  }
});

app.get('/messages', async (req, res) => {
  try{
    const messages = await Message.find({});
    res.send(messages)
  } catch(err){
    res.status(400).send(err.message)
  }
});

app.get('/messages/:messageId', async (req, res) => {
  const messageId = req.params.messageId;
  try{
    const message = await Message.findById(messageId).exec();

    res.json(message);
  } catch(err){
    res.status(400).send(err.message)
  }
});

app.delete('/messages/:messageId', async (req, res) => {
  try {
    const messageId = mongoose.Types.ObjectId(req.params.messageId);
    await Message.findByIdAndDelete(messageId);

    res.status(200).send("deleted")
  } catch (err){
    res.status(400).send(err)
  };
});

app.post('/likes', async (req, res) => {
  const messageId = req.body.messageId;
  const username = req.body.username;
  try{
    const id = mongoose.Types.ObjectId();
    const message = await Message.findById(messageId).exec();
    const newLike = {
      _id: id,
      username: username,
      messageId: messageId,
    };
    
    await message.like.push(newLike);
    await message.save();
    res.status(201).send(newLike);
  } catch(err){
    res.status(400).send(err.message)
  }
});

app.delete('/likes/:likeId', async (req, res) => {
  const likeId = mongoose.Types.ObjectId(req.params.likeId);
  try{
    const message = await Message.findOne({ "like._id": likeId })
    const deletedLike = message.like.find(like => like._id == req.params.likeId)
    await message.like.pull(deletedLike)
    message.save()
    res.status(200).send(message);
  } catch(err){
    res.status(400).send(err.message)
  }
});