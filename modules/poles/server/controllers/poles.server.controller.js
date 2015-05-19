'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	path = require('path'),
	mongoose = require('mongoose'),
	Pole = mongoose.model('Pole'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a Pole
 */
exports.create = function(req, res) {
	var pole = new Pole(req.body);
	pole.user = req.user;

	pole.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(pole);
		}
	});
};

/**
 * Show the current Pole
 */
exports.read = function(req, res) {
	res.jsonp(req.pole);
};

/**
 * Update a Pole
 */
exports.update = function(req, res) {
	var pole = req.pole ;

	pole = _.extend(pole , req.body);

	pole.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(pole);
		}
	});
};

/**
 * Delete an Pole
 */
exports.delete = function(req, res) {
	var pole = req.pole ;

	pole.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(pole);
		}
	});
};

/**
 * List of Poles
 */
exports.list = function(req, res) { Pole.find().sort('-created').populate('user', 'displayName').exec(function(err, poles) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(poles);
		}
	});
};

/**
 * Pole middleware
 */
exports.poleByID = function(req, res, next, id) { Pole.findById(id).populate('user', 'displayName').exec(function(err, pole) {
		if (err) return next(err);
		if (! pole) return next(new Error('Failed to load Pole ' + id));
		req.pole = pole ;
		next();
	});
};