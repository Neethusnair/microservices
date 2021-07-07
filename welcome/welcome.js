const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Model = require('./models');
//const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
require('dotenv/config');



app.use(express.json());
app.use(cookieParser());


// enable server to be able to use css and js files
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))

app.set('view-engine', 'ejs')

// to read input to forms
app.use(express.urlencoded({ extended: false}))

app.get('/welcome/lists', auth, async(req, res) => {  
  try{
    const Models = await Model.find();
    res.render('list.ejs',{
    userList: Models
  });
     //res.json(Models);    
  }catch (error) {
    console.log(error);
    res.json({ message: err });
   } 
});

//Extract token from cookies
function auth(req, res, next) {
  const token = req.cookies.jwt;
  if(!token) return res.status(401).send('No Token Available. You cannot view this page.');

  try {
    const verify = jwt.verify(token, process.env.ACCESS_TOKEN);
    req.user = verify;
    next();
  } catch (err){
    res.status(403).send('Invalid Token.You cannot view this page');
  }
}

// Connect to DB
const {
    MONGO_USERNAME,
    MONGO_PASSWORD,
    MONGO_HOSTNAME,
    MONGO_PORT,
    MONGO_DB
  } = process.env;
  
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000
  };
  
  const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;
  
  mongoose.connect(url, options).then( function() {
    console.log('MongoDB is connected');
  })
    .catch( function(err) {
    console.log(err);
  });

// start listening to server
app.listen(4000);
