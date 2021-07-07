const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Model = require('./models');
const bcrypt = require('bcrypt');
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

app.get('/', (req, res) => {
    res.render('login.ejs');
});

app.get('/register', (req, res) => {
    res.render('register.ejs');
});

app.post('/', async(req, res) => {
    const valmodel = await Model.findOne({email: req.body.email});
    if(!valmodel) return res.status(400).json({
        error: 'invalid email id'
    });
    const valpass = await bcrypt.compare(req.body.password, valmodel.password);
    if(!valpass) return res.status(400).json({
        error: 'invalid password'
    });

    // connect to list
    const PORT = process.env.PORT;
    
    // create JWT token
    const accessToken = jwt.sign({_id: valmodel._id }, process.env.ACCESS_TOKEN);
    res.cookie('jwt', accessToken, {httpOnly: true, maxAge: 1000 * 60 * 60 * 24});
    res.cookie('email', req.body.email);
    res.status(201).json(PORT);
});    

app.post('/register', async(req, res) => {
    //Check if email already exist
    const emailPresent = await Model.findOne({email: req.body.email});
    if(emailPresent) return res.status(400).json({
        error: 'Email id already in use'
    });

    //Encryt password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    //Create new user
    const model = new Model({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });
    
    // connect to list
    const PORT = process.env.PORT;

    // create JWT token
    const accessToken = jwt.sign({_id: model._id }, process.env.ACCESS_TOKEN);
    res.cookie('jwt', accessToken, {httpOnly: true, maxAge: 1000 * 60 * 60 * 24});
    res.cookie('email', req.body.email);

    try{
        const savedModel = await model.save();
        res.json(PORT);
    }catch (err) {
        res.json({ message: err });
    }      
});

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
app.listen(3000);
