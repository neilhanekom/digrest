'use strict';

module.exports = function(app) {
	var poles = require('../controllers/poles.server.controller');
	var polesPolicy = require('../policies/poles.server.policy');

	// Poles Routes
	app.route('/api/poles')
		.get(poles.list)
		.post(poles.create);

	app.route('/api/poles/:poleId')
		.get(poles.read)
		.put(poles.update)
		.delete(poles.delete);

	// Finish by binding the Pole middleware
	app.param('poleId', poles.poleByID);
};