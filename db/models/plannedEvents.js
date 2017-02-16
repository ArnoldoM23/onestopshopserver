'use strict';

module.exports = (function () {
  return function (sequelize, DataTypes) {
    const PlannedEvents = sequelize.define('PlannedEvents', {
      plannedEvents_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      client_id: { type: DataTypes.BIGINT },
      vendor_id: { type: DataTypes.BIGINT },
      dateOfEvent: { defaultValue: null, type: DataTypes.STRING }
    }, {
      timestamp: false
    });
    return PlannedEvents;
  };
}());
