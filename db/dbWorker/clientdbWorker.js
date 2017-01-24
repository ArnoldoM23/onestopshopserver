'use strict'

const models = require("../models");
const sequelize = require('../models/index').sequelize;

const clientdbWorker = {
	queue: [],
	error: [],
	updateProfile(data, req, res, next){
		models.Client.findOne({ client_id: req.user.id })
			.then(client => {
				client.updateAttribute(newUpdates)
					.then(response => res.send(response) )
    	  	.catch(err => console.error(err))
			})
			.catch()
	}
}


function addToDB(data, storagePlace, req, res, next) {
	const container = { data, storagePlace, req, res, next };
	clientdbWorker.queue.push(container);
	let currentContainer = clientdbWorker.queue[0];
	function callWorker(funcName, obj) {
		clientdbWorker[funcName](obj.data, obj.req, obj.res, obj.next, (status) => {
			if (status) {
				clientdbWorker.queue.shift();	
			}
			if(clientdbWorker.queue.length > 0){
				currentContainer = clientdbWorker.queue[0];
				clientdbWorker[currentContainer.storagePlace];
				callWorker(currentContainer.storagePlace, currentContainer);
			}else{
				return;
			}
		});
	};
	callWorker(currentContainer.storagePlace, currentContainer);
};

function handleError(data, destination, err){
	clientdbWorker.error.push({ data: data, destination: destination, error: err});
	clientdbWorker.queue.shift();
	if (clientdbWorker.error.length > 5) {
		console.log(clientdbWorker.error);
	}
}

module.exports = addToDB;