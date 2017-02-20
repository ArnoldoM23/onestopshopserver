'use strict';

const models = require('../models');
const sequelize = require('../models/index').sequelize;
const { handleError } = require('./dbHelpers');

const plannedEventsdbWorker = {
	queue: [],
	error: [],
	addingAVendorToClient(data, req, res, next, success) {
		models.PlannedEvents.create({ client_id: data.client_id, vendor_id: data.vendor_id })
			.then(event => {
				success(true);
				res.send({ message: 'Vendor has been added ' });	
			})
			.catch(err => {
				handleError(plannedEventsdbWorker, data, 'updateProfile', err);
				next(err);
			});
	},

	getEventTotal(data, req, res, next, success) {
		sequelize.query(`SELECT sum(price) FROM Vendors v
										JOIN PlannedEvents pv ON v.vendor_id = pv.vendor_id
										WHERE pv.client_id = ${data.client_id}`)
			.then(total => {
				success(true);
				res.json(total);
			})
			.catch(err => {
				handleError(plannedEventsdbWorker, data, 'getEventTotal', err);
				next(err);
			});
	}
};

module.exports = plannedEventsdbWorker;
