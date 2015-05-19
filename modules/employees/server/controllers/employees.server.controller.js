'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	path = require('path'),
	mongoose = require('mongoose'),
	Employee = mongoose.model('Employee'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a Employee
 */
exports.create = function(req, res) {
	var employee = new Employee(req.body);
	employee.user = req.user;

	employee.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(employee);
		}
	});
};

/**
 * Show the current Employee
 */
exports.read = function(req, res) {
	res.jsonp(req.employee);
};

/**
 * Update a Employee
 */
exports.update = function(req, res) {
	var employee = req.employee ;

	employee = _.extend(employee , req.body);

	employee.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(employee);
		}
	});
};

/**
 * Delete an Employee
 */
exports.delete = function(req, res) {
	var employee = req.employee ;

	employee.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(employee);
		}
	});
};

/**
 * List of Employees
 */
exports.list = function(req, res) { Employee.find().sort('-created').populate('user', 'displayName').exec(function(err, employees) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(employees);
		}
	});
};

/**
 * Employee middleware
 */
exports.employeeByID = function(req, res, next, id) { Employee.findById(id).populate('user', 'displayName').exec(function(err, employee) {
		if (err) return next(err);
		if (! employee) return next(new Error('Failed to load Employee ' + id));
		req.employee = employee ;
		next();
	});
};