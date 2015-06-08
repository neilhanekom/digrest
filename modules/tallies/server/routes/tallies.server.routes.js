'use strict';

module.exports = function(app) {
	var tallies = require('../controllers/tallies.server.controller');
	var talliesPolicy = require('../policies/tallies.server.policy');

	// Tallies Routes
	app.route('/api/tallies')
		.get(tallies.list)
		.post(tallies.create);

	app.route('/api/tallies/:tallyId')
		.get(tallies.read)
		.put(tallies.update)
		.delete(tallies.delete);

	// Finish by binding the Tally middleware
	app.param('tallyId', tallies.tallyByID);
};