'use strict';
/*
 * Packages in use:
 * _express
 * _mongoose --> https://mongoosejs.com
 * // _mongodb --> Collections :
 *                # users
 *                # ways --> routes of the user
 * _bootstrap
 * _jquery
 * _leaflet
 * _popper
 * //_connect-flash -->https://www.npmjs.com/package/connect-flash
 * _express-session -->https://www.npmjs.com/package/express-session
 * //_cookie-session --> https://expressjs.com/en/resources/middleware/cookie-session.html
 * _body-parser --> https://www.npmjs.com/package/body-parser
 */

 // install mongodb; optionally install mongo client
 // see: http://mongodb.github.io/node-mongodb-native/3.1/quick-start/quick-start/
 //
 // change to the directory containing this file
 // $ cd PATH/database-mongodb
 // create data folder and run mongod service
 // $ mkdir data
 // $ mongod --dbpath=./data --> look one line down
 // "C:\Program Files\MongoDB\Server\4.0\bin\mongod.exe" --dbpath="C:\Users\Dorian\github\GeoAbgabe\data"
 // "C:\Program Files\MongoDB\Server\4.0\bin\"

 // --> better
 // cd C:\Program Files\MongoDB\Server\4.0\bin\
 // mongo


// http require
//const processenv = require('processenv');


// alot of example scripts : https://github.com/bradtraversy/nodekb
const http = require('http');
const port =  3000;



// express reqiure
const express = require('express');

const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//initialize mongoose connection
mongoose.connect('mongodb://localhost:27017/mydb', {useNewUrlParser: true});
let db = mongoose.connection;

// check for connections
db.once('open', function(){
  console.log('Connected to MongoDB');
});

// check for DB errors
db.on('error', function(err){
  console.log(err);
});

// initialize app
const app = express();
var User = require("./modelclasses/users");
//const pug = require('pug');
//set vieww
app.set("view engine", "pug");

app.use(express.json());
// for parsing application/json
// support parsing of application/json type post data
app.use(bodyParser.json());


//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false }));

// Use the session middleware
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}));





// 1. install client side modules using: $npm install leaflet jquery bootstrap popper.js
// 2. make packages available for client using statics:
app.use("/leaflet", express.static(__dirname + "/node_modules/leaflet/dist"));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use('/popper', express.static(__dirname + '/node_modules/popper.js/dist'));


//get the scripts
app.use("/routesLeafletjs", express.static(__dirname + '/scripts/routesLeaflet.js'))
app.use("/createroutesLeafletjs", express.static(__dirname + '/scripts/createrouteleaflet.js'))

// set the options for session user!
app.get('*', function(req, res, next){
  console.log('requested  username =  ' + req.session.user);
  res.locals.user = req.session.user || null;
  res.locals.userroutes = req.session.routes || null;
  //res.locals.userroutes = req.session.routes || null;
  console.log('res.locals.user =  ' + app.locals.user);

  if(res.locals.user != null){
        User.findOne({ name: res.locals.user }, function (err, user) {
        res.locals.userroutes = user.routes;
        console.log('res.locals.userroutes =  ' + res.locals.userroutes.length);
      });

    console.log('res.locals.userroutesdddddddddddddddddd =  ' + res.locals.userroutes[0].waypoints);
  }

  console.log('req.method:  ' + req.method + ' | req path: ' +  req.path + ' | req.params: ' + req.params);
  next();
});





// import routes Routers for use
var usersRouter = require("./routes/users");
app.use('/users', usersRouter);
var routesRouter = require("./routes/routes");
app.use('/routes', routesRouter);
// Routes controll
app.get("/", function(req, res, next) {
  res.render("indexp");
});

// Routes controll
app.get("/routes", function(req, res, next) {
  res.render("leafletcreateroute");
});
app.get("/meetings", function(req, res, next){
  res.render("leafletmeetings")
});

//pls REMOOOVEVEEVEVE
//app.get("/", (req, res) => { res.sendFile(__dirname + "/index.html"); });
app.get("/newworld", (req, res) => { res.sendFile(__dirname + "/leaflet.html"); });
app.get("/helloworld", (req, res) => res.send("Hello World!"));




app.listen(port, () => console.log("Example app listening on port " + port + "!"));