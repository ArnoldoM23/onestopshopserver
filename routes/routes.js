'use strict';
const Auth = require('../controllers/auth');
const passportService = require('../service/passport');
const passport = require('passport');
const jwt = require('jwt-simple');
const config = require('../config');
const vendorCtrl = require('../controllers/vendorCtrl');
const clientCtrl = require('../controllers/clientCtrl');
const requireAuth = passport.authenticate('jwt', {session: false});
const requireSignin = passport.authenticate('local', {session: false});

// const ROOT_URL = 'http://localhost:3000';

const ROOT_URL = 'http://shoponceserver.herokuapp.com';


function tokenForUser(user){
	var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate() + 60);

	const timestamp = parseInt(exp.getTime() / 1000);
	return jwt.encode({ id: user.user_id, iat: timestamp }, process.env.SECRET || config.SECRET)
}

module.exports = function(app){

	app.get('/', requireAuth, function(req, res, next){
		res.send({message: "But it work tho"})
	});
	// local sign in and sign up routes
	app.post('/signin/', requireSignin, Auth.signin);
	app.post('/signup/', Auth.signup)
	// ================= Facebook login =======================
	app.get('/auth/facebook/', passport.authenticate('facebook'));
	app.get('/auth/facebook/callback/',
	  passport.authenticate('facebook',  { failureRedirect: `${ROOT_URL}/signin` }), 
	  function(req, res){
	  	const token = tokenForUser(req.user)
	    res.redirect(`${ROOT_URL}/?token=${token}`)
	  });
	// ================= Google login =======================
	app.get('/auth/google/', passport.authenticate('google', { scope : ['profile', 'email'] }));
	app.get('/auth/google/callback/',
	  passport.authenticate('google',  { failureRedirect: `${ROOT_URL}/signin` }), 
	  function(req, res){
	  	const token = tokenForUser(req.user)
	    res.redirect(`${ROOT_URL}/?token=${token}`)
	  });

	app.get('/getAllVendors', vendorCtrl.getAllVendors);

	app.post('/createVendor', vendorCtrl.createVendor);
	app.post('/updateClient', requireAuth, clientCtrl.updateProfile)
};