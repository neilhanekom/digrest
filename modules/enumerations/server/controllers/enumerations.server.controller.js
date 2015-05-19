'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	path = require('path'),
	mongoose = require('mongoose'),
	Enumeration = mongoose.model('Enumeration'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a Enumeration
 */
exports.create = function(req, res) {
	console.log(req.body);
	var enumeration = new Enumeration(req.body);
	enumeration.user = req.user;

	enumeration.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(enumeration);
		}
	});
};

/**
 * Show the current Enumeration
 */
exports.read = function(req, res) {
	res.jsonp(req.enumeration);
};

/**
 * Update a Enumeration
 */
exports.update = function(req, res) {
	var enumeration = req.enumeration ;

	enumeration = _.extend(enumeration , req.body);

	enumeration.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(enumeration);
		}
	});
};

/**
 * Delete an Enumeration
 */
exports.delete = function(req, res) {
	var enumeration = req.enumeration ;

	enumeration.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(enumeration);
		}
	});
};

/**
 * List of Enumerations
 */
exports.list = function(req, res) { Enumeration.find().sort('-created').populate('user', 'displayName').exec(function(err, enumerations) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(enumerations);
		}
	});
};

/**
 * Enumeration middleware
 */
exports.enumerationByID = function(req, res, next, id) { Enumeration.findById(id).populate('user', 'displayName').exec(function(err, enumeration) {
		if (err) return next(err);
		if (! enumeration) return next(new Error('Failed to load Enumeration ' + id));
		req.enumeration = enumeration ;
		next();
	});
};