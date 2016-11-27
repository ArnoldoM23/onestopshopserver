'use strict';
// const models = require("../db/models");
// const sequelize = require('../db/models/index.js').sequelize;
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
	app.post('/signin/', requireSignin, Auth.signin);
	app.post('/signup/', Auth.signup)
	// ================= Facebook login =======================
	app.get('/auth/facebook/', passport.authenticate('facebook'));
	app.get('/auth/facebook/callback/',
	  passport.authenticate('facebook',  { failureRedirect: 'http://localhost:3000/signin' }), 
	  function(req, res){
	  	const token = tokenForUser(req.user)
	  	// This will redirect back to home page and add the token to the url
	    res.redirect('http://localhost:3000/?token=' + token)
	  });

	app.get('/auth/google/', passport.authenticate('google'));
	app.get('/auth/google/callback/',
	  passport.authenticate('facebook',  { failureRedirect: 'http://localhost:3000/signin' }), 
	  function(req, res){
	  	const token = tokenForUser(req.user)
	  	// This will redirect back to home page and add the token to the url
	    res.redirect('http://localhost:3000/?token=' + token)
	  });
};