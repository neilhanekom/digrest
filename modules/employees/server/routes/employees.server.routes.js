'use strict';

module.exports = function(app) {
	var employees = require('../controllers/employees.server.controller');
	var employeesPolicy = require('../policies/employees.server.policy');

	// Employees Routes
	app.route('/api/employees')
		.get(employees.list)
		.post(employees.create);

	app.route('/api/employees/:employeeId')
		.get(employees.read)
		.put(employees.update)
		.delete(employees.delete);

	// Finish by binding the Employee middleware
	app.param('employeeId', employees.employeeByID);
};