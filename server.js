const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3090;
const cors = require('cors');
const router = require('./routes/routes');
const passport = require('passport');
const models = require('./db/models');

var pg = require('pg');
// UNCOMMENT FOR DEPLOY AND CONNECT TO HEROKU DATABASE
// pg.defaults.ssl = true;


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

models.sequelize.sync({force: false}).then(() => {
  app.listen(PORT, () => console.log('listening on port', PORT));
});