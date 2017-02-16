 'use strict';

const models = require('../models');
const { handleError } = require('./dbHelpers');

const vendorDBWorker = {
	queue: [],
	error: [],
	updateVendor(data, req, res, next, cb) {
		models.Vendors.findOne({ where: { vendor_id: req.user.dataValues.vendor_id } })
			.then(vendor => {
				vendor.updateAttributes(data)
					.then(updatedVendor => {
						cb(true);
						res.send(updatedVendor);
					})
					.catch(err => {
						handleError(vendorDBWorker, data, 'updateVendor', err);
						next(err);
					});
			})
			.catch(err => {
				handleError(vendorDBWorker, data, 'updateVendor', err);
				next(err);
			});
	}
};

module.exports = vendorDBWorker;
