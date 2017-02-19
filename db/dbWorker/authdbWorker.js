'use strict';

const bcrypt = require('bcrypt-nodejs');
const models = require('../models');
const { getToken } = require('../../service/authService/authHelpers');
const { handleError } = require('./dbHelpers');

const ROOT_URL = 'http://localhost:3000';
// const ROOT_URL = 'http://shoponceserver.herokuapp.com';

const authDBWorker = {
  queue: [],
	error: [],
  signup(credentials, req, res, next, success) {
  // refactor this to signup vender as well.
		models.Users.findOne({ where: { userEmail: credentials.email } })
			.then(user => {
				if (user) {
					success(true);
					res.status(422).json({ error: 'You Already exists' });
				} else {
					bcrypt.genSalt(10, (err, salt) => {
						if (err) { return next(err); }
						bcrypt.hash(credentials.password, salt, null, (err, hash) => {
							if (err) { return next(err); }
							// Create new user
							models.Users.create({ userPassword: hash, userEmail: credentials.email })
								.then(user => { 
									success(true);
									res.json({ id: user.dataValues.user_id });
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
	socialLogin(data, req, res, next, success) {
		const id = `user${data.label}`;
		const condition = {};
		condition[id] = data.id;
		models.Users.findOne({ where: condition })
      .then(user => {
        if (user) {
					success(true);
					user.isNew = false;
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
							success(true);
							user.isNew = true;
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
	},

	createVendorOrClient(data, req, res, next, success) {
		models[data.type].findOne({ where: { user_id: data.id } })
			.then(user => {
				if (user) { 
					success(true);
					res.status(422).json({ error: 'You Already exists' });
				}
				models[data.type].create({ user_id: data.id })
					.then(newUser => {
						success(true);
						res.json({ token: getToken(newUser) });
					})
					.catch(err => {
						handleError(authDBWorker, data, 'createVendorOrClient', err);
						next(err);
					});
			})
			.catch(err => {
				handleError(authDBWorker, data, 'createVendorOrClient', err);
				next(err);
			});
	}
};

module.exports = authDBWorker;
