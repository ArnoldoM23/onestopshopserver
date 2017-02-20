(function () {
	'use strict';

	const authRouter = require('express').Router();
	const passportService = require('../service/authService/passport');
	const Auth = require('../controllers/auth');
	const passport = require('passport');
	const getToken = require('../service/authService/authHelpers');
	
	const requireSignin = passport.authenticate('local', { session: false });

	const ROOT_URL = 'http://localhost:3000';
	// const ROOT_URL = 'http://shoponce.herokuapp.com';

	// ================= Local login =======================
	authRouter.route('/signin/')
		.post(requireSignin, Auth.signin);
	authRouter.route('/signup/')
		.post(Auth.signup);
	authRouter.route('/becomeVendorOrClient/')
		.post(Auth.becomeVendorOrClient);
		
	// ================= Facebook login =======================	
	authRouter.route('/auth/facebook/')
		.get(passport.authenticate('facebook', { scope: 'email' }));
	authRouter.route('/auth/facebook/callback/')
		.get(passport.authenticate('facebook', { failureRedirect: `${ROOT_URL}/signin` }), 
			(req, res) => {
			const token = getToken.getToken(req.user);
			if (req.user.isNew) {
				res.redirect(`${ROOT_URL}/vendorOrClient/?id=${req.user.dataValues.user_id}`);
			} else {
				res.redirect(`${ROOT_URL}/?token=${token}`);
			}
		});
	// ================= Google login =======================
	authRouter.route('/auth/google/')
		.get(passport.authenticate('google', { scope: ['profile', 'email'] }));
	authRouter.route('/auth/google/callback/')
		.get(passport.authenticate('google', { failureRedirect: `${ROOT_URL}/signin` }), (req, res) => {
			const token = getToken.getToken(req.user);
			if (req.user.isNew) {
				res.redirect(`${ROOT_URL}/vendorOrClient/?id=${req.user.dataValues.user_id}`);
			} else {
				res.redirect(`${ROOT_URL}/?token=${token}`);
			}
		});

	module.exports = authRouter;
}());
