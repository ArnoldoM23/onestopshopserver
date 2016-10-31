const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jwt-simple');
const config = require('../config');


const UserSchema = new Schema({
	email: {type: String, unique: true, lowercase: true},
	password: String,
	name: String,
	facebook_id: String
});

UserSchema.pre('save', function(next){
	const user = this;

	bcrypt.genSalt(10, function(err, salt){
		if (err) { return next(err); }
		bcrypt.hash(user.password, salt, null, function(err, hash){
			if (err) { return next(err); }

			user.password = hash;
			next();
		});
	});
});

UserSchema.methods.comparePassword = function(candidatePassword, callback){
	bcrypt.compare(candidatePassword, this.password, function(err, match){
		if(err){ return callback(err); }
		callback(null, match);
	});
};

// function getUserToken(user){
// 	const timeStamp = new Date().getTime();
// 	return jwt.encode({_id: user.id, exp: parseInt(exp.getTime() / 1000)}, config.secret);
// };

UserSchema.methods.generateJWT = function() {
  // set expiration to 60 days
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate() + 60);
// Create and return the token
  return jwt.encode({
    _id: this._id,
    username: this.username,
    exp: parseInt(exp.getTime() / 1000),
  }, config.secret);
};

const ModelClass = mongoose.model('user', UserSchema);

module.exports = ModelClass;