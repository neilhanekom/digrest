'use strict';

module.exports = function(app) {
	var enumerations = require('../controllers/enumerations.server.controller');
	var enumerationsPolicy = require('../policies/enumerations.server.policy');

	// Enumerations Routes
	app.route('/api/enumerations')
		.get(enumerations.list)
		.post(enumerations.create);

	app.route('/api/enumerations/:enumerationId')
		.get(enumerations.read)
		.put(enumerations.update)
		.delete(enumerations.delete);

	// Finish by binding the Enumeration middleware
	app.param('enumerationId', enumerations.enumerationByID);
};