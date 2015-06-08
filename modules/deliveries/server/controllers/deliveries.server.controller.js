'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	path = require('path'),
	mongoose = require('mongoose'),
	Delivery = mongoose.model('Delivery'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a Delivery
 */
exports.create = function(req, res) {
	var delivery = new Delivery(req.body);
	delivery.user = req.user;

	delivery.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(delivery);
		}
	});
};

/**
 * Show the current Delivery
 */
exports.read = function(req, res) {
	res.jsonp(req.delivery);
};

/**
 * Update a Delivery
 */
exports.update = function(req, res) {
	var delivery = req.delivery ;

	delivery = _.extend(delivery , req.body);

	delivery.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(delivery);
		}
	});
};

/**
 * Delete an Delivery
 */
exports.delete = function(req, res) {
	var delivery = req.delivery ;

	delivery.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(delivery);
		}
	});
};

/**
 * List of Deliveries
 */
exports.list = function(req, res) { Delivery.find().sort('-created').populate('user', 'displayName').exec(function(err, deliveries) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(deliveries);
		}
	});
};

/**
 * Delivery middleware
 */
exports.deliveryByID = function(req, res, next, id) { Delivery.findById(id).populate('user', 'displayName').exec(function(err, delivery) {
		if (err) return next(err);
		if (! delivery) return next(new Error('Failed to load Delivery ' + id));
		req.delivery = delivery ;
		next();
	});
};