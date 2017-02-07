'use strict';

const models = require('../models');

const clientdbWorker = {
	queue: [],
	error: [],
	updateProfile(data, req, res, next, cb) {
		models.Clients.findOne({ where: { client_id: req.user.dataValues.client_id } })
			.then(client => {
				client.updateAttributes(data)
					.then(response => {
						cb(true);
						res.send(response);
					})
    	  	.catch(err => {
			  		handleError(data, 'updateProfile', err);
			  		next(err);
			  	});
			})
			.catch(err => {
	  		handleError(data, 'updateProfile', err);
	  		next(err);
	  	});
	}
};

function addToDB(data, storagePlace, req, res, next) {
	const container = { data, storagePlace, req, res, next };
	clientdbWorker.queue.push(container);
	let currentContainer = clientdbWorker.queue[0];
	function callWorker(funcName, obj) {
		clientdbWorker[funcName](obj.data, obj.req, obj.res, obj.next, (status) => {
			if (status) {
				clientdbWorker.queue.shift();	
			}
			if (clientdbWorker.queue.length > 0) {
				currentContainer = clientdbWorker.queue[0];
				callWorker(currentContainer.storagePlace, currentContainer);
			} else {
				return;
			}
		});
	}
	callWorker(currentContainer.storagePlace, currentContainer);
}

function handleError(data, destination, err) {
	clientdbWorker.error.push({ data, destination, error: err });
	clientdbWorker.queue.shift();
	if (clientdbWorker.error.length > 5) {
		console.log(clientdbWorker.error);
	}
}

module.exports = addToDB;
