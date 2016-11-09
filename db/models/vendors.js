const Sequelize = require('sequelize');
const sequelize = require('../sqlconnect');

const Vendor = sequelize.define('venders', {
	vendor_id: {
		type: Sequelize.STRING,
		primaryKey: true
	},
	name: Sequelize.STRING,
	email: Sequelize.STRING,
	phone: Sequelize.STRING,
	location: Sequelize.STRING
	// pictures: url
});

Vendor.sync({force: false})
	.then(() =>{
		console.log("Users table was created")
	});

module.exports = Vendor;