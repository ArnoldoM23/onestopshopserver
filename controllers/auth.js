'use strict';

const authdbWorker = require('../db/dbWorker/authdbWorker');
const getToken = require('../service/authService/authHelpers');
const { addToDatabase } = require('../db/dbWorker/dbHelpers');

// SING IN ==============================
exports.signin = function (req, res) {
	res.send({ token: getToken.getToken(req.user) });
};
// SING UP ==============================
exports.signup = function (req, res, next) {
	const email = req.body.email;
	const password = req.body.password;
	if (!email || !password) {
		return res.status(422).json({ error: 'You must provide email and password ' });
	}
	// add user to database
	addToDatabase(authdbWorker, req.body, 'signup', req, res, next);
};
// SING UP Vendor ==============================
exports.signupVendor = function (req, res, next) {
	if (!req.body.email && !req.body.password) {
		return res.status(422).json({ error: 'You must provide email and password ' });
	}
	addToDatabase(authdbWorker, req.body, 'signupVendor', req, res, next);
};
