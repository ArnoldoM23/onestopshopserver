const models = require('../db/models');

module.exports = {
	updateProfile(req, res){
		models.Client.findOne({ client_id: req.body.client_id })
			.then(client => {
				client.updateAttribute(req.body.newUpdates)
					.then(response => res.send(response) )
    	  	.catch(err => console.error(err))
			})
			.catch()
	}

}