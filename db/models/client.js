'use strict';

module.exports = (function () {
	return function (sequilize, DataTypes) {
		const Client = sequilize.define('Client', {
			client_id: {
				type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
			},
			user_id: DataTypes.BIGINT,
			total: DataTypes.BIGINT
		}, {
			timestamp: false
		});
		return Client;
	};
}());
