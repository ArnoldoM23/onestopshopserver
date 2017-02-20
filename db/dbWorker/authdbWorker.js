'use strict';

const bcrypt = require('bcrypt-nodejs');
const models = require('../models');
const { getToken } = require('../../service/authService/authHelpers');
const { handleError } = require('./dbHelpers');

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
		// create label for google or facebook
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

	becomeVendorOrClient(data, req, res, next, success) {
		// TODO: add username to token for social login.

		models[data.userType].findOne({ where: { user_id: data.user_id } })
			.then(user => {
				if (user) { 
					success(true);
					res.status(422).json({ error: 'You Already exists' });
				}
				// Create a new vendor or client
				models[data.userType].create({ user_id: data.user_id })
					.then(newUser => {
						newUser.userType = data.userType;
						newUser.user_id = data.user_id;
						const token = { token: getToken(newUser) };
						const client_id = Number(newUser.dataValues.client_id);
						const vendor_id = Number(newUser.dataValues.vendor_id);
						const typeData = { userType: data.userType, userTypeId: client_id || vendor_id };
						authDBWorker.updateUser(typeData, data.user_id, res, token, success, next);
					})
					.catch(err => {
						handleError(authDBWorker, data, 'becomeVendorOrClient', err);
						next(err);
					});
			})
			.catch(err => {
				handleError(authDBWorker, data, 'becomeVendorOrClient', err);
				next(err);
			});
	},

	updateUser(data, id, res, responseData, success, next) {
		models.Users.findOne({ where: { user_id: id } })
			.then(user => {
				user.updateAttributes(data)
					.then(updatedClient => {
						success(true);
						res.json(responseData || updatedClient);
					})
					.catch(err => {
						handleError(authDBWorker, data, 'updateUser', err);
						next(err);
					});
			})
			.catch(err => {
				handleError(authDBWorker, data, 'updateProfile', err);
				next(err);
			});
	}
};

module.exports = authDBWorker;
