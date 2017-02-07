'use strict';

const authAddToDB = require('../db/dbWorker/authdbWorker');
const getToken = require('../service/authService/authHelpers');

// SING IN ==============================
exports.signin = function (req, res) {
	res.send({ token: getToken.getToken(req.user), user: req.user });
};

// SING UP ==============================
exports.signup = function (req, res, next) {
	const email = req.body.email;
	const password = req.body.password;
	if (!email || !password) {
		return res.status(422).json({ error: 'You must provide email and password ' });
	}
	// add user to database
	authAddToDB(req.body, 'signup', req, res, next);
};
