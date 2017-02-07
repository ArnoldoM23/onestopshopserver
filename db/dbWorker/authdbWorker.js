'use strict';

const bcrypt = require('bcrypt-nodejs');
const models = require('../models');
const getToken = require('../../service/authService/authHelpers');

const authDBWorker = {
  queue: [],
	error: [],
  signup(credentials, req, res, next, cb) {
  // refactor this to signup vender as well.
		models.Clients.findOne({ where: { clientEmail: credentials.email } })
	    .then(user => {
	      if (user) {
	      	cb(true);
	      	res.status(422).json({ error: 'You Already exists' });
	      } else {
	      	bcrypt.genSalt(10, (err, salt) => {
						if (err) { return next(err); }
						bcrypt.hash(credentials.password, salt, null, (err, hash) => {
							if (err) { return next(err); }
							// Create new user
							models.Clients.create({ clientPassword: hash, clientEmail: credentials.email })
		            .then(user => { 
		            	cb(true);
		            	res.json({ token: getToken.getToken(user) });
		            })
		            .catch(err => {
						  		handleError(credentials, 'signup', err);
						  		next(err);
						  	});
						});
					}); 
	      }
		  })
	  	.catch(err => {
	  		handleError(credentials, 'signup');
	  		next(err);
	  	});
	},
	socialLogin(data, req, res, next, cb) {
		const id = `client${data.label}`;
		const condition = {};
		condition[id] = data.id;
		models.Clients.findOne({ where: condition })
      .then(user => {
        if (user) {
        	cb(true);
          return data.done(null, user);
        } 
      	const newUser = { clientFirstName: data.first_name, clientLastName: data.last_name, clientEmail: data.email };
      	newUser[id] = data.id;
        models.Clients.create(newUser)
            .then(user => { 
            	cb(true);
            	data.done(null, user);
            })
            .catch(err => {
            	handleError(data, 'socialLogin', err);
            	data.done(err); 
            });  
      })
      .catch(err => {
	    	handleError(data, 'socialLogin', err);
	    	data.done(err); 
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
			if (authDBWorker.queue.length > 0) {
				currentContainer = authDBWorker.queue[0];
				callWorker(currentContainer.storagePlace, currentContainer);
			} else {
				return;
			}
		});
	}
	callWorker(currentContainer.storagePlace, currentContainer);
}

function handleError(data, destination, err) {
	authDBWorker.error.push({ data, destination, error: err });
	authDBWorker.queue.shift();
	if (authDBWorker.error.length > 5) {
		console.log(authDBWorker.error);
	}
}

module.exports = addToDB;
