'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	path = require('path'),
	mongoose = require('mongoose'),
	Compartment = mongoose.model('Compartment'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a Compartment
 */
exports.create = function(req, res) {
	var compartment = new Compartment(req.body);
	compartment.user = req.user;

	compartment.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(compartment);
		}
	});
};

/**
 * Show the current Compartment
 */
exports.read = function(req, res) {
	res.jsonp(req.compartment);
};

/**
 * Update a Compartment
 */
exports.update = function(req, res) {
	var compartment = req.compartment ;

	compartment = _.extend(compartment , req.body);

	compartment.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(compartment);
		}
	});
};

/**
 * Delete an Compartment
 */
exports.delete = function(req, res) {
	var compartment = req.compartment ;

	compartment.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(compartment);
		}
	});
};

/**
 * List of Compartments
 */
exports.list = function(req, res) { Compartment.find().sort('-created').populate('user', 'displayName').populate('placards').exec(function(err, compartments) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(compartments);
		}
	});
};

/**
 * Compartment middleware
 */
exports.compartmentByID = function(req, res, next, id) { Compartment.findById(id).populate('user', 'displayName').populate('placards').exec(function(err, compartment) {
		if (err) return next(err);
		if (! compartment) return next(new Error('Failed to load Compartment ' + id));
		req.compartment = compartment ;
		next();
	});
};