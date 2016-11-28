const models = require('../db/models');

module.exports = {
	createVendor(req, res){
		models.Vendors.create(req.body)
			.then(vendor => { res.send(vendor) })
			.catch(err => console.log(err))
	},

	getAllVendors(){
		models.Vendors.findAll()
			.then(vendors => { 
				const allVendors = { 
					business1: [], business2: [], business3: [], business4: [], business5: [] 
				}; 
				vendors.forEach(vendor => {
					switch(vendor.category){
						case business1:
							business1.push(vendor);
							break;
						case business2:
							business2.push(vendor);
							break;
						case business3:
							business3.push(vendor);
							break;
						case business4:
							business4.push(vendor);
							break;
						case business5:
							business5.push(vendor);
							break;
					}
				});
				res.send(allVendors); 
			})
			.catch(err =>  console.log(err) )
	},


}