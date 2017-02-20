'use strict';

const models = require('../models');
const { handleError } = require('./dbHelpers');

const clientdbWorker = {
	queue: [],
	error: [],
	updateProfile(data, req, res, next, cb) {
		models.Users.findOne({ where: { user_id: req.user.dataValues.user_id } })
			.then(user => {
				user.updateAttributes(data)
					.then(updatedClient => {
						cb(true);
						res.send(updatedClient);
					})
					.catch(err => {
						handleError(clientdbWorker, data, 'updateProfile', err);
						next(err);
					});
			})
			.catch(err => {
				handleError(clientdbWorker, data, 'updateProfile', err);
				next(err);
			});
	}
};

module.exports = clientdbWorker;
