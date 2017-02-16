'use strict';

const clientDBWorker = require('../db/dbWorker/clientdbWorker');
const { addToDatabase } = require('../db/dbWorker/dbHelpers');

module.exports = {
	updateProfile(req, res, next) {
		addToDatabase(clientDBWorker, req.body, 'updateProfile', req, res, next);
	}

};
