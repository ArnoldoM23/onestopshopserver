"use strict";
module.exports = function() {

  return function(sequelize, DataTypes) {
    var Clients = sequelize.define("Clients", {
      client_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      clientFacebook_id: {defaultValue: null, type: DataTypes.STRING},
      clientGoogle_id: {defaultValue: null, type: DataTypes.STRING}, 
      clientFirstName: {defaultValue: null, type: DataTypes.STRING},
      clientLastName: {defaultValue: null, type: DataTypes.STRING},
      clientEmail: { type: DataTypes.STRING, unique: true },
      clientPassword: DataTypes.STRING,
      clientPhone: {defaultValue: '111-111-1111', type: DataTypes.STRING},
      total: { defaultValue: 0, type: DataTypes.INTEGER }
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