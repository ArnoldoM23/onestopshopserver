'use strict';

const passport = require('passport');
const authRouter = require('./authRouter');
const clientRouter = require('./clientRouter');
const vendorRouter = require('./vendorRouter');

const requireAuth = passport.authenticate('jwt', { session: false });

module.exports = function (app) {
	app.use('/', authRouter);
	app.use('/client', requireAuth, clientRouter);
	app.use('/vendor', requireAuth, vendorRouter);
};
