'use strict';

module.exports = function(app) {
	var placards = require('../controllers/placards.server.controller');
	var placardsPolicy = require('../policies/placards.server.policy');

	// Placards Routes
	app.route('/api/placards').all()
		.get(placards.list).all(placardsPolicy.isAllowed)
		.post(placards.create);

	app.route('/api/placards/:placardId').all(placardsPolicy.isAllowed)
		.get(placards.read)
		.put(placards.update)
		.delete(placards.delete);

	// Finish by binding the Placard middleware
	app.param('placardId', placards.placardByID);
};