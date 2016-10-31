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

mongoose.connect('mongodb://localhost:auth/auth');

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

app.use(express.static('../client/'));
router(app);

app.get('/', function(req, res){
	res.send("working")
})



const server = http.createServer(app);

server.listen(port);
console.log("Server listening on: ", port);