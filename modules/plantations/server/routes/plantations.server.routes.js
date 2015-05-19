'use strict';

module.exports = function(app) {
	var plantations = require('../controllers/plantations.server.controller');
	var plantationsPolicy = require('../policies/plantations.server.policy');

	// Plantations Routes
	app.route('/api/plantations')
		.get(plantations.list)
		.post(plantations.create);

	app.route('/api/plantations/:plantationId')
		.get(plantations.read)
		.put(plantations.update)
		.delete(plantations.delete);

	// Finish by binding the Plantation middleware
	app.param('plantationId', plantations.plantationByID);
};

// policies removed
// .all()
//.all(plantationsPolicy.isAllowed)
//.all(plantationsPolicy.isAllowed)

