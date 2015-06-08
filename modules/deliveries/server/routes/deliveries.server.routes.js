'use strict';

module.exports = function(app) {
	var deliveries = require('../controllers/deliveries.server.controller');
	var deliveriesPolicy = require('../policies/deliveries.server.policy');

	// Deliveries Routes
	app.route('/api/deliveries').all()
		.get(deliveries.list).all(deliveriesPolicy.isAllowed)
		.post(deliveries.create);

	app.route('/api/deliveries/:deliveryId').all(deliveriesPolicy.isAllowed)
		.get(deliveries.read)
		.put(deliveries.update)
		.delete(deliveries.delete);

	// Finish by binding the Delivery middleware
	app.param('deliveryId', deliveries.deliveryByID);
};