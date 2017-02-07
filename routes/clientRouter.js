(function () {
	'use strict';

	const clientRouter = require('express').Router();
	const clientCtrl = require('../controllers/clientCtrl');
	const models = require('../db/models');

	clientRouter.param('id', (req, res, next, id) => {
		models.Clients.findOne({ where: { client_id: id } })
			.then(user => {
				if (!user) { next(null); }
				req.user = user;
				next();	
			})
			.catch(err => next(err));
	});

	clientRouter.route('/:id/updateClient')
		.post(clientCtrl.updateProfile);

	module.exports = clientRouter;
}());
