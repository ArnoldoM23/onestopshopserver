'use strict';

const jwt = require('jwt-simple');
const config = require('../../config');

function tokenForUser(user) {
  const today = new Date();
  const exp = new Date(today);
  exp.setDate(today.getDate() + 60);
  const timestamp = parseInt(exp.getTime() / 1000);
  return jwt.encode({ 
		id: user.user_id,
    name: user.userFirstName, 
		type: user.userType, 
		typeId: user.vendor_id || user.client_id || user.userTypeId, 
		iat: timestamp 
  }, config.SECRET);
}

module.exports = { getToken: tokenForUser };
