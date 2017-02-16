'use strict';

function addToDatabase(dbWorker, data, storagePlace, req, res, next) {
	const container = { data, storagePlace, req, res, next };
	dbWorker.queue.push(container);
	let currentContainer = dbWorker.queue[0];
	function callWorker(funcName, obj) {
		dbWorker[funcName](obj.data, obj.req, obj.res, obj.next, (status) => {
			if (status) {
				dbWorker.queue.shift();	
			}
			if (dbWorker.queue.length > 0) {
				currentContainer = dbWorker.queue[0];
				callWorker(currentContainer.storagePlace, currentContainer);
			} else {
				return;
			}
		});
	}
	callWorker(currentContainer.storagePlace, currentContainer);
}

function handleError(dbWorker, data, destination, err) {
	dbWorker.error.push({ data, destination, error: err });
	dbWorker.queue.shift();
	if (dbWorker.error.length > 5) {
		console.log(dbWorker.error);
	}
}

module.exports = { addToDatabase, handleError };
