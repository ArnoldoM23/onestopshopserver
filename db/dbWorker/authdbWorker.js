'use strict';

const bcrypt = require('bcrypt-nodejs');
const models = require('../models');
const getToken = require('../../service/authService/authHelpers');
const { handleError } = require('./dbHelpers');

const authDBWorker = {
  queue: [],
	error: [],
  signup(credentials, req, res, next, cb) {
  // refactor this to signup vender as well.
		models.Users.findOne({ where: { userEmail: credentials.email } })
			.then(user => {
				if (user) {
					cb(true);
					res.status(422).json({ error: 'You Already exists' });
				} else {
					bcrypt.genSalt(10, (err, salt) => {
						if (err) { return next(err); }
						bcrypt.hash(credentials.password, salt, null, (err, hash) => {
							if (err) { return next(err); }
							// Create new user
							models.Users.create({ userPassword: hash, userEmail: credentials.email })
								.then(user => { 
									cb(true);
									res.json({ token: getToken.getToken(user) });
								})
								.catch(err => {
									handleError(authDBWorker, credentials, 'signup', err);
									next(err);
								});
						});
					}); 
				}
			})
			.catch(err => {
				handleError(authDBWorker, credentials, 'signup', err);
				next(err);
			});
	},
	socialLogin(data, req, res, next, cb) {
		const id = `user${data.label}`;
		const condition = {};
		condition[id] = data.id;
		models.Users.findOne({ where: condition })
      .then(user => {
        if (user) {
					cb(true);
          return data.done(null, user);
        } 
				const newUser = { 
					userFirstName: data.first_name, 
					userLastName: data.last_name, 
					userEmail: data.email 
				};
				newUser[id] = data.id;
        models.Users.create(newUser)
            .then(user => { 
							cb(true);
							data.done(null, user);
            })
            .catch(err => {
							handleError(authDBWorker, data, 'socialLogin', err);
							data.done(err); 
            });  
      })
      .catch(err => {
				handleError(authDBWorker, data, 'socialLogin', err);
				data.done(err); 
			});
	}
};

module.exports = authDBWorker;
