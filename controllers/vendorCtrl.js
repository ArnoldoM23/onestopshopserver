conts vendors = require('../db/models/vendors');

module.exports = {
	createVendor(req, res){
		vendors.create(req.body)
			.then(vendor => { res.send(vendor) })
			.catch(err => console.log(err))
	},

	getAllVendors(){
		vendor.findAll()
			.then(vendors => { res.send(vendors) })
			.catch(err =>  console.log(err) )
	}	
}