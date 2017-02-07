const models = require('../db/models');
const authAddToDB = require('../db/dbWorker/authdbWorker');
const clientDBWorker = require('../db/dbWorker/clientdbWorker');
module.exports = {
	updateProfile(req, res, next){
		clientDBWorker(req.body, 'updateProfile', req, res, next)
	}

}