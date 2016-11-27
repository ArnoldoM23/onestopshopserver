"use strict";
module.exports = function() {

  return function(sequelize, DataTypes) {
    var UserVendor = sequelize.define("UserVendor", {
      userVendor_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      clients_id:  DataTypes.STRING,
      providers_id: DataTypes.STRING
      }, {
      timestamps: false
    });
    return UserVendor;
  };
}()

