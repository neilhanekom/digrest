'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	path = require('path'),
	mongoose = require('mongoose'),
	Placard = mongoose.model('Placard'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a Placard
 */
exports.create = function(req, res) {
	var placard = new Placard(req.body);
	placard.user = req.user;

	placard.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(placard);
		}
	});
};

/**
 * Show the current Placard
 */
exports.read = function(req, res) {
	res.jsonp(req.placard);
};

/**
 * Update a Placard
 */
exports.update = function(req, res) {
	var placard = req.placard ;

	placard = _.extend(placard , req.body);

	placard.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(placard);
		}
	});
};

/**
 * Delete an Placard
 */
exports.delete = function(req, res) {
	var placard = req.placard ;

	placard.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(placard);
		}
	});
};

/**
 * List of Placards
 */
exports.list = function(req, res) { Placard.find().sort('-created').populate('user', 'displayName').exec(function(err, placards) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(placards);
		}
	});
};

/**
 * Placard middleware
 */
exports.placardByID = function(req, res, next, id) { Placard.findById(id).populate('user', 'displayName').exec(function(err, placard) {
		if (err) return next(err);
		if (! placard) return next(new Error('Failed to load Placard ' + id));
		req.placard = placard ;
		next();
	});
};