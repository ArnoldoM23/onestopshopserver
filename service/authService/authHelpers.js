'use strict';

const jwt = require('jwt-simple');
const config = require('../../config');

function tokenForUser(user) {
  const today = new Date();
  const exp = new Date(today);
  exp.setDate(today.getDate() + 60);
  const timestamp = parseInt(exp.getTime() / 1000);
  return jwt.encode({ id: user.user_id, iat: timestamp }, config.SECRET);
}

module.exports = { getToken: tokenForUser };
