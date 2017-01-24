'use strict'
const jwt = require('jwt-simple');
const bcrypt = require('bcrypt-nodejs');
const config = require('../../config');
const models = require("../models");
const sequelize = require('../models/index').sequelize;
const getToken = require('../../service/authService/passport');
const Promise = require('bluebird');

const authDBWorker = {
  queue: [],
	error: [],
  signup(credentials, req, res, next, cb) {
		models.Clients.findOne( { where: { clientEmail: credentials.email } })
    .then( user => {
      if (user) {
      	res.status(422).json({ error: "You Already exists"});
      } else{
      	bcrypt.genSalt(10, function(err, salt) {
					if (err) { return next(err); }
					bcrypt.hash(credentials.password, salt, null, function(err, hash) {
						if (err) { return next(err); }
						// Create new user
						 models.Clients.create({ clientPassword: hash, clientEmail: credentials.email })
	            .then(user =>  { 
	            	cb(true);
	            	res.json({ token: getToken.getToken(user) }, err)
	            })
	            .catch(err => {
					  		handleError(credentials, "signup", err)
					  		next(err);
					  	})
					});
				}); 
      }
  	})
  	.catch(err => {
  		handleError(credentials, "signup")
  		next(err);
  	})
	},
	socialLogin(data, req, res, next, cb){
		const id = 'client' + data.label;
		const condition = {}
		condition[id] = data.id;
		models.Clients.findOne( { where: condition })
      .then(user => {
        if (user) {
          return data.done(null, user)
        } else{
        	const newUser = { clientFirstName: data._json.first_name, clientLastName: data._json.last_name,  clientEmail: data._json.email };
        	newUser[id] = data.id;
          models.Clients.create(newUser)
              .then(user =>  { 
              	cb(true);
              	data.done(null, user) 
              })
              .catch(err => {
              	handleError(data, 'socialLogin', err)
              	data.done(err) 
              });
        }
      })
      .catch(err => {
	    	handleError(data, 'socialLogin',err)
	    	data.done(err) 
	    });
	}
};

function addToDB(data, storagePlace, req, res, next) {
	const container = { data, storagePlace, req, res, next };
	authDBWorker.queue.push(container);
	let currentContainer = authDBWorker.queue[0];
	function callWorker(funcName, obj) {
		authDBWorker[funcName](obj.data, obj.req, obj.res, obj.next, (status) => {
			if (status) {
				authDBWorker.queue.shift();	
			}
			if(authDBWorker.queue.length > 0){
				currentContainer = authDBWorker.queue[0];
				authDBWorker[currentContainer.storagePlace];
				callWorker(currentContainer.storagePlace, currentContainer);
			}else{
				return;
			}
		});
	};
	callWorker(currentContainer.storagePlace, currentContainer);
};

function handleError(data, destination, err){
	authDBWorker.error.push({ data: data, destination: destination, error: err});
	authDBWorker.queue.shift();
	if (authDBWorker.error.length > 5) {
		console.log(authDBWorker.error);
	}
}

module.exports = addToDB;
