(function () {
	'use strict';

	const clientRouter = require('express').Router();
	const clientCtrl = require('../controllers/clientCtrl');
	const models = require('../db/models');

	clientRouter.param('id', (req, res, next, id) => {
		models.Users.findOne({ where: { user_id: id } })
			.then(user => {
				if (!user) { next(null); }
				req.user = user;
				next();	
			})
			.catch(err => next(err));
	});

	clientRouter.route('/:id/updateClient')
		.post(clientCtrl.updateProfile);
	clientRouter.route('/addingAVendorToClient')
		.post(clientCtrl.addingAVendorToClient);
	clientRouter.route('/getEventTotal')
		.post(clientCtrl.getEventTotal);

	module.exports = clientRouter;
}());
