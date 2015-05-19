'use strict';

module.exports = function(app) {
	var compartments = require('../controllers/compartments.server.controller');
	var compartmentsPolicy = require('../policies/compartments.server.policy');

	// Compartments Routes
	app.route('/api/compartments')
		.get(compartments.list)
		.post(compartments.create);

	app.route('/api/compartments/:compartmentId')
		.get(compartments.read)
		.put(compartments.update)
		.delete(compartments.delete);

	// Finish by binding the Compartment middleware
	app.param('compartmentId', compartments.compartmentByID);
};