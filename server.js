const express = require('express');
const morgan = require('morgan');
const http = require('http');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const port = process.env.PORT || 3090;
const cors = require('cors');
const router = require('./routes/routes');
const passport = require('passport');
const sequelize = require('./db/sqlconnect')

var pg = require('pg');
// UNCOMMENT FOR DEPLOY AND CONNECT TO HEROKU DATABASE
pg.defaults.ssl = true;


sequelize
  .authenticate()
  .then(function(err) {
    console.log('Connection has been established successfully.');
  })
  .catch(function (err) {
    console.log('Unable to connect to the database:', err);
  })

// mongoose.connect('mongodb://museum:museum12345@ds043027.mlab.com:43027/vrmuseum');
// // mongoose.connect('mongodb://charchar23:123onestop@ds139277.mlab.com:39277/onestop');
// mongoose.connect('mongodb://localhost:auth/auth');

app.all('/*', function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   res.header("Access-Control-Allow-Methods", "GET, POST","PUT");
   next();

});


app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(cors());


router(app);


const server = http.createServer(app);

server.listen(port);
console.log("Server listening on: ", port);