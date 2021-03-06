'use strict';

module.exports = (function () {
  return function (sequelize, DataTypes) {
    const Vendors = sequelize.define('Vendors', {
      vendor_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: DataTypes.BIGINT,
      category: { defaultValue: 'Vendor', type: DataTypes.STRING },
      location: { defaultValue: 'Walnut Creek.', type: DataTypes.STRING },
      price: { defaultValue: 0, type: DataTypes.INTEGER }
    }, {
      timestamps: false
    });
    return Vendors;
  };
}());
