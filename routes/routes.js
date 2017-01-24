'use strict';

const passportService = require('../service/authService/passport');
const passport = require('passport');
const jwt = require('jwt-simple');
const config = require('../config');
const authRouter = require('./authRouter');
const clientRouter = require('./clientRouter');
const vendorRouter = require('./vendorRouter');
const requireAuth = passport.authenticate('jwt', {session: false});
const requireSignin = passport.authenticate('local', {session: false});

module.exports = function(app){
	app.use('/', authRouter)
	app.use('/client', requireAuth, clientRouter)
	app.use('/vendors', requireAuth, vendorRouter)
};