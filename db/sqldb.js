const Sequelize = require('sequelize');
const sequelize = require('./sqlconnect');


const Users = sequelize.define('users', {
	user_id: {
    type: Sequelize.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING,
  email: Sequelize.STRING,
  password: Sequelize.STRING,
  phoneNumber: Sequelize.STRING
}, {timestamps: false});

Users.sync({force: false})
	.then(() =>{
		console.log("Users table was created")
	});

module.exports = Users;