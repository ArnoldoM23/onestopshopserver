'use strict'
const jwt = require('jwt-simple');
const bcrypt = require('bcrypt-nodejs');
const config = require('../config');
const models = require("../db/models");
const sequelize = require('../db/models/index').sequelize;
// TODO: Reafactor to into user model
function tokenForUser(user){
	var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate() + 60);

	const timestamp = parseInt(exp.getTime() / 1000);
	return jwt.encode({ id: user.user_id, iat: timestamp }, config.secret)
}


// SING IN ==============================
exports.signin = function(req, res, next){
	console.log("WHAT IS REQ USER", req.user)
	res.send({ token: tokenForUser(req.user), user: req.user });
}


// SING UP ==============================
exports.signup = function(req, res, next){
	const email = req.body.email;
	const password = req.body.password;
	const name = req.body.name;
	
	// See if a user wiht a given email exists
	if (!email || !password ) {
		return res.status(422).json({ error: "You must provide email and password "})
	}

	models.users.findOne( { where: { email: email } })
    .then(user => {
      if (user) {
        return next(null, user)
      } else{

      	bcrypt.genSalt(10, function(err, salt){
					if (err) { return next(err); }
					bcrypt.hash(password, salt, null, function(err, hash){
						if (err) { return next(err); }
						// Create new user
						models.users.create({  password: hash, email: email })
	            .then(user =>  { res.json({token: tokenForUser(user) }) })
	            .catch(err => next(err) );
						
					});
				});
        
      }
  	})
  	.catch(err => next(err))
}