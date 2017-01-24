const models = require('../db/models');
const clientDBWorker = require('../db/dbWorker/clientdbWorker');

module.exports = {
	updateProfile(req, res, next){
		console.log('Im here in updateProfile')
		req.body.id = req.user.id;
		clientDBWorker(req.body, 'updateProfile', req, res, next)
		res.send()
	}

}