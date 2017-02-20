'use strict';

const clientDBWorker = require('../db/dbWorker/clientdbWorker');
const plannedEventsdbWorker = require('../db/dbWorker/plannedEventsdbWorker');
const { addToDatabase } = require('../db/dbWorker/dbHelpers');

module.exports = {
	updateProfile(req, res, next) {
		addToDatabase(clientDBWorker, req.body, 'updateProfile', req, res, next);
	},

	addingAVendorToClient(req, res, next) {
		addToDatabase(plannedEventsdbWorker, req.body, 'addingAVendorToClient', req, res, next);
	},

	getEventTotal(req, res, next) {
		addToDatabase(plannedEventsdbWorker, req.body, 'getEventTotal', req, res, next);
	}
};
