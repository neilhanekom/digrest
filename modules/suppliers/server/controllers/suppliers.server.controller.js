'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	path = require('path'),
	mongoose = require('mongoose'),
	Supplier = mongoose.model('Supplier'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a Supplier
 */
exports.create = function(req, res) {
	var supplier = new Supplier(req.body);
	supplier.user = req.user;

	supplier.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(supplier);
		}
	});
};

/**
 * Show the current Supplier
 */
exports.read = function(req, res) {
	res.jsonp(req.supplier);
};

/**
 * Update a Supplier
 */
exports.update = function(req, res) {
	var supplier = req.supplier ;

	supplier = _.extend(supplier , req.body);

	supplier.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(supplier);
		}
	});
};

/**
 * Delete an Supplier
 */
exports.delete = function(req, res) {
	var supplier = req.supplier ;

	supplier.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(supplier);
		}
	});
};

/**
 * List of Suppliers
 */
exports.list = function(req, res) { Supplier.find().sort('-created').populate('user', 'displayName').populate('plantations').exec(function(err, suppliers) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(suppliers);
		}
	});
};

/**
 * Supplier middleware
 */
exports.supplierByID = function(req, res, next, id) { Supplier.findById(id).populate('user', 'displayName').populate('plantations').exec(function(err, supplier) {
		if (err) return next(err);
		if (! supplier) return next(new Error('Failed to load Supplier ' + id));
		req.supplier = supplier ;
		next();
	});
};