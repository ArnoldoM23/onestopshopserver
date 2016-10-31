const Sequelize = require('sequelize');

const sequelize = new Sequelize('postgres://icgmexbycqrtvl:mJPu5TXKxFBDt5vMBbSB_pQg5d@ec2-54-243-126-40.compute-1.amazonaws.com:5432/d53r4g7ejf87na');

module.exports = sequelize;