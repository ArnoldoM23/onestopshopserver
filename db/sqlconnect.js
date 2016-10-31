const Sequelize = require('sequelize');

const sequelize = new Sequelize('onestop', 'young', '', {
  host: 'localhost',
  dialect: 'postgres',
  port: 5432

});

module.exports = sequelize;