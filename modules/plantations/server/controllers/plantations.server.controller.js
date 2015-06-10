'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	path = require('path'),
	mongoose = require('mongoose'),
	Plantation = mongoose.model('Plantation'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a Plantation
 */
exports.create = function(req, res) {
	var plantation = new Plantation(req.body);
	plantation.user = req.user;

	plantation.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(plantation);
		}
	});
};

/**
 * Show the current Plantation
 */
exports.read = function(req, res) {
	res.jsonp(req.plantation);
};

/**
 * Update a Plantation
 */
exports.update = function(req, res) {
	var plantation = req.plantation ;

	plantation = _.extend(plantation , req.body);

	plantation.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(plantation);
		}
	});
};

/**
 * Delete an Plantation
 */
exports.delete = function(req, res) {
	var plantation = req.plantation ;

	plantation.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(plantation);
		}
	});
};

/**
 * List of Plantations
 */
exports.list = function(req, res) { Plantation.find().sort('-created').populate('user', 'displayName').populate('compartments').exec(function(err, plantations) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(plantations);
		}
	});
};

/**
 * Plantation middleware
 */
exports.plantationByID = function(req, res, next, id) { Plantation.findById(id).populate('user', 'displayName').populate('compartments').exec(function(err, plantation) {
		if (err) return next(err);
		if (! plantation) return next(new Error('Failed to load Plantation ' + id));
		req.plantation = plantation ;
		next();
	});
};