"use strict";
module.exports = function() {

  return function(sequelize, DataTypes) {
    var Vendors = sequelize.define("Vendors", {
      vendor_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      facebook_id: {defaultValue: null, type: DataTypes.STRING},
      google_id: {defaultValue: null, type: DataTypes.STRING},
      vendorFirstName: {defaultValue: 'John', type: DataTypes.STRING},
      vendorLastName: {defaultValue: 'Doe', type: DataTypes.STRING},
			vendorEmail: { type: DataTypes.STRING, unique: true },
      vendorPhone: {defaultValue: '111-111-1111', type: DataTypes.STRING},
      password: {defaultValue: null, type: DataTypes.STRING},
      location: {defaultValue: null, type: DataTypes.STRING}
      // logo: url
			// pictures: url
      }, {
      timestamps: false,
      classMethods: {
        associate: function(models) {
          Vendors.belongsToMany(models.Clients, {
            through: {
              model: models.UserVendor,
              unique: false
            },
            foreignKey: 'clients_id',
            constraints: false
          }); 
        }
      }
    });
    return Vendors;
  };
}()