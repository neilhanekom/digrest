'use strict';

module.exports = function(app) {
	var orders = require('../controllers/orders.server.controller');
	var ordersPolicy = require('../policies/orders.server.policy');

	// Orders Routes
	app.route('/api/orders').all()
		.get(orders.list).all(ordersPolicy.isAllowed)
		.post(orders.create);

	app.route('/api/orders/:orderId').all(ordersPolicy.isAllowed)
		.get(orders.read)
		.put(orders.update)
		.delete(orders.delete);

	// Finish by binding the Order middleware
	app.param('orderId', orders.orderByID);
};