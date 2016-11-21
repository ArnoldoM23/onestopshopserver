"use strict";
module.exports = function() {

  return function(sequelize, DataTypes) {
    var vendors = sequelize.define("vendors", {
      vendor_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      facebook_id: DataTypes.STRING,
      google_id: DataTypes.STRING,
      name: DataTypes.STRING,
			email: DataTypes.STRING,
			phone: DataTypes.STRING,
      password: DataTypes.BOOLEAN,
      phoneNumber: DataTypes.STRING,
			location: DataTypes.STRING
			// pictures: url
      }, {
      timestamps: false,
      classMethods: {
        // associate: function(models) { 
        //   vendors.belongsTo(models.users, {
        //     foreignKey: 'user_id',
        //     onDelete: 'set null',
        //     onUpdate: 'cascade'
        //   }); 
        // }
      }
    });
    return vendors;
  };
}()