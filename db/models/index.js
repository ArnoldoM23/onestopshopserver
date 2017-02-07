module.exports = (function () {
  'use strict';

  const fs = require('fs');
  const path = require('path');
  const Sequelize = require('sequelize');
  const config = require('../config.json');
  // const env = process.env.NODE_ENV || 'development';
  // For Heroku
  config.port = process.env.DB_PORT || config.port;
  config.host = process.env.DB_HOST || config.host;
  config.username = process.env.DB_USER || config.username;
  config.password = process.env.DB_PASSWORD || config.password;
  config.database = process.env.DB_NAME || config.database;

  const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: 'postgres',
    port: config.port

  });
  const db = {};

  fs
    .readdirSync(__dirname)
    .filter((file) => {
      return (file.indexOf('.') !== 0) && (file !== 'index.js');
    })
    .forEach((file) => {
      const model = sequelize.import(path.join(__dirname, file));
      db[model.name] = model;
    });

  Object.keys(db).forEach((modelName) => {
    if ('associate' in db[modelName]) {
      db[modelName].associate(db);
    }
  });

  db.sequelize = sequelize;
  db.Sequelize = Sequelize;
  return db;
}());
