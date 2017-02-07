'use strict';

module.exports = (function () {
  return function (sequelize, DataTypes) {
    const Vendors = sequelize.define('Vendors', {
      vendor_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      category: { defaultValue: null, type: DataTypes.STRING },
      vendorFacebook_id: { defaultValue: null, type: DataTypes.STRING },
      vendorGoogle_id: { defaultValue: null, type: DataTypes.STRING },
      vendorFirstName: { defaultValue: 'John', type: DataTypes.STRING },
      vendorLastName: { defaultValue: 'Doe', type: DataTypes.STRING },
			vendorEmail: { type: DataTypes.STRING, unique: true },
      vendorPhone: { defaultValue: '111-111-1111', type: DataTypes.STRING },
      vendorPassword: DataTypes.STRING,
      location: { defaultValue: null, type: DataTypes.STRING },
      price: { defaultValue: 0, type: DataTypes.INTEGER }
      }, {
      timestamps: false,
      classMethods: {
        associate(models) {
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
}());
