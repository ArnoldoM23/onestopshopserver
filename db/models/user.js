'use strict';

module.exports = (function () {
  return function (sequelize, DataTypes) {
    const Users = sequelize.define('Users', {
      user_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      userFacebook_id: { defaultValue: null, type: DataTypes.STRING },
      userGoogle_id: { defaultValue: null, type: DataTypes.STRING }, 
      userFirstName: { defaultValue: null, type: DataTypes.STRING },
      userLastName: { defaultValue: null, type: DataTypes.STRING },
      userEmail: { type: DataTypes.STRING, unique: true },
      userPassword: DataTypes.STRING,
      userPhone: { defaultValue: '111-111-1111', type: DataTypes.STRING },
      userType: { defaultValue: null, type: DataTypes.STRING },
      userTypeId: DataTypes.BIGINT
    }, {
      timestamps: false
    });
    return Users;
  };
}());
