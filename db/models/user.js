"use strict";
module.exports = function() {

  return function(sequelize, DataTypes) {
    var users = sequelize.define("users", {
      user_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      facebook_id: {defaultValue: null, type: DataTypes.STRING},
      google_id: {defaultValue: null, type: DataTypes.STRING},
      firstName: {defaultValue: 'John', type: DataTypes.STRING},
      lastName: {defaultValue: 'Doe', type: DataTypes.STRING},
      email: { type: DataTypes.STRING, unique: true },
      password: DataTypes.STRING,
      phoneNumber: {defaultValue: '111-111-1111', type: DataTypes.STRING}
      }, {
      timestamps: false,
      classMethods: {
        // associate: function(models) { 
        //   users.hasMany(models.vendors, {
        //     foreignKey: 'vendor_id',
        //     onDelete: 'set null',
        //     onUpdate: 'cascade'
        //   }); 
        // }
      }
    });
    return users;
  };
}()