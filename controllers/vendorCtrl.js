const models = require('../db/models');

module.exports = {
	createVendor(req, res) {
		models.Vendors.create(req.body)
			.then(vendor => res.send(vendor))
			.catch(err => console.log(err));
	},

	getAllVendors(req, res) {
		models.Vendors.findAll()
			.then(vendors => res.send(vendors))
			.catch(err => console.log(err));
	},

};
