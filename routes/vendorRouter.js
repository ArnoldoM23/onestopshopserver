(function () {
	'use strict';

	const vendorRouter = require('express').Router();
	const vendorCtrl = require('../controllers/vendorCtrl');
	const models = require('../db/models');

	vendorRouter.param('vendorID', (req, res, next, id) => {
		models.Vendors.findOne({ where: { vendor_id: id } })
			.then(vendor => {
				if (!vendor) { next(null); }
				req.vendor = vendor;
				next();
			})
			.catch(err => next(err));
	});
 
	vendorRouter.route('/:vendorID/updateVendor')
		.post(vendorCtrl.updateVendor);

	vendorRouter.route('/getAllVendors')
		.get(vendorCtrl.getAllVendors);

	module.exports = vendorRouter;
}());
