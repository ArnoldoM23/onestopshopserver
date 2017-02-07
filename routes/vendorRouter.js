(function () {
	'use strict';

	const vendorRouter = require('express').Router();
	const vendorCtrl = require('../controllers/vendorCtrl');
 
	vendorRouter.route('/getAllVendors')
		.get(vendorCtrl.getAllVendors);
	// app.get('/getAllVendors', vendorCtrl.getAllVendors);
	// app.post('/createVendor', vendorCtrl.createVendor);
	module.exports = vendorRouter;
}());
