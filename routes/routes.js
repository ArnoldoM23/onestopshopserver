'use strict';
const models = require("../db/models");
const sequelize = require('../db/models/index.js').sequelize;
const Auth = require('../controllers/auth');
const passportService = require('../service/passport');
const passport = require('passport');




const requireAuth = passport.authenticate('jwt', {session: false});
const requireSignin = passport.authenticate('local', {session: false});

module.exports = function(app){

	app.get('/',  function(req, res, next){
		res.send({message: "But it work tho"})
	});


	// local sign in and sign up routes
	app.post('/signin', requireSignin, Auth.signin);
	app.post('/signup', Auth.signup)
	
};