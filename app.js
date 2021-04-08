const express = require('express');
const app = express();
const port = 3000;

// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://rdetzler:Goaway88@group-18-kapstone.kbjox.mongodb.net/kapstonebackend?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

app.use(express.json());

let db = {
  "users":[
    {pictureLocation:null,username:"ryantest",displayName:"test",about:"",createdAt:"2021-04-08T13:45:46.358Z",updatedAt:"2021-04-08T13:45:46.358Z"},
    {pictureLocation:null,username:"Johnny",displayName:"Johnny",about:"",createdAt:"2021-04-05T15:14:51.302Z",updatedAt:"2021-04-05T15:14:51.302Z"},
    {pictureLocation:null,username:"ooss",displayName:"ssss",about:"",createdAt:"2021-03-31T14:53:36.426Z",updatedAt:"2021-03-31T14:53:36.426Z"},
  ]};

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

app.get('/', (req, res) => {
  console.log("get request received")
  res.send('Hello World!')
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});