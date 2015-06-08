'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	path = require('path'),
	mongoose = require('mongoose'),
	Tally = mongoose.model('Tally'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a Tally
 */
exports.create = function(req, res) {
	var tally = new Tally(req.body);
	tally.user = req.user;

	tally.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tally);
		}
	});
};

/**
 * Show the current Tally
 */
exports.read = function(req, res) {
	res.jsonp(req.tally);
};

/**
 * Update a Tally
 */
exports.update = function(req, res) {
	var tally = req.tally ;

	tally = _.extend(tally , req.body);

	tally.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tally);
		}
	});
};

/**
 * Delete an Tally
 */
exports.delete = function(req, res) {
	var tally = req.tally ;

	tally.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tally);
		}
	});
};

/**
 * List of Tallies
 */
exports.list = function(req, res) { Tally.find().sort('-created').populate('user', 'displayName').exec(function(err, tallies) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tallies);
		}
	});
};

/**
 * Tally middleware
 */
exports.tallyByID = function(req, res, next, id) { Tally.findById(id).populate('user', 'displayName').exec(function(err, tally) {
		if (err) return next(err);
		if (! tally) return next(new Error('Failed to load Tally ' + id));
		req.tally = tally ;
		next();
	});
};