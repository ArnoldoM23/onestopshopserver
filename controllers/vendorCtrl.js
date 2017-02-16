const { addToDatabase } = require('../db/dbWorker/dbHelpers');
const vendorDBWorker = require('../db/dbWorker/vendordbWorker');
const models = require('../db/models');

module.exports = {
	updateVendor(req, res, next) {
		addToDatabase(vendorDBWorker, req.body, 'updateVendor', req, res, next);
	},

	getAllVendors(req, res) {
		models.Vendors.findAll()
			.then(vendors => {
				res.json(vendors);
			})
			.catch(err => console.log(err));
	},

	getVendorByCategory(req, res) {
		models.Vendors.findAll({ where: { category: req.body.category } })
			.then(vendors => {
				res.json(vendors);
			})
			.catch(err => console.log(err));
	}

};
