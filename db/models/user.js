"use strict";
module.exports = function() {

  return function(sequelize, DataTypes) {
    var Clients = sequelize.define("Clients", {
      client_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      facebook_id: {defaultValue: null, type: DataTypes.STRING},
      google_id: {defaultValue: null, type: DataTypes.STRING},
      // user_pic: {defaultValue: null, type: url  }, 
      userFirstName: {defaultValue: 'John', type: DataTypes.STRING},
      userLastName: {defaultValue: 'Doe', type: DataTypes.STRING},
      userEmail: { type: DataTypes.STRING, unique: true },
      password: DataTypes.STRING,
      clientPhone: {defaultValue: '111-111-1111', type: DataTypes.STRING}
      }, {
      timestamps: false,
      classMethods: {
        associate: function(models) { 
          Clients.belongsToMany(models.Vendors, {
            through: {
              model: models.UserVendor,
              unique: false
            },
            foreignKey: 'providers_id',
            constraints: false
          }); 
        }
      }
    });
    return Clients;
  };
}()