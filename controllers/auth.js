const jwt = require('jwt-simple');
const config = require('../config');
const model = require('../db/mongodb');

// function getUserToken(user){
// 	const timeStamp = new Date().getTime();
// 	return jwt.encode({sub: user.id, iat: timeStamp}, config.secret);
// };

exports.signin = function(req, res, next){
	res.send({ token: req.user.generateJWT() });
}