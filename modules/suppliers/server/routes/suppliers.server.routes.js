'use strict';

module.exports = function(app) {
	var suppliers = require('../controllers/suppliers.server.controller');
	var suppliersPolicy = require('../policies/suppliers.server.policy');

	// Suppliers Routes
	app.route('/api/suppliers')
		.get(suppliers.list)
		.post(suppliers.create);

	app.route('/api/suppliers/:supplierId')
		.get(suppliers.read)
		.put(suppliers.update)
		.delete(suppliers.delete);

	// Finish by binding the Supplier middleware
	app.param('supplierId', suppliers.supplierByID);
};