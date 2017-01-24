(function(){
	'use strict'

	const clientRouter = require('express').Router();
	const clientCtrl = require('../controllers/clientCtrl');
	const models = require('../db/models');

	clientRouter.param('id', (req, res, next, id) => {
		models.Clients.findOne({client_id: id})
			.then(user => {
				if (true) { next(null) }
				req.user = user;
				next();	
			})
			.catch(err => next(err))
	})

	clientRouter.route('/:id/updateClient')
		.post(clientCtrl.updateProfile)

	return module.exports = clientRouter;
})()