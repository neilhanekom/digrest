'use strict';

var should = require('should'),
	request = require('supertest'),
	path = require('path'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Tally = mongoose.model('Tally'),
	express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, tally;

/**
 * Tally routes tests
 */
describe('Tally CRUD tests', function() {
	before(function(done) {
		// Get application
		app = express.init(mongoose);
		agent = request.agent(app);

		done();
	});

	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Tally
		user.save(function() {
			tally = {
				name: 'Tally Name'
			};

			done();
		});
	});

	it('should be able to save Tally instance if logged in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tally
				agent.post('/api/tallies')
					.send(tally)
					.expect(200)
					.end(function(tallySaveErr, tallySaveRes) {
						// Handle Tally save error
						if (tallySaveErr) done(tallySaveErr);

						// Get a list of Tallies
						agent.get('/api/tallies')
							.end(function(talliesGetErr, talliesGetRes) {
								// Handle Tally save error
								if (talliesGetErr) done(talliesGetErr);

								// Get Tallies list
								var tallies = talliesGetRes.body;

								// Set assertions
								(tallies[0].user._id).should.equal(userId);
								(tallies[0].name).should.match('Tally Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Tally instance if not logged in', function(done) {
		agent.post('/api/tallies')
			.send(tally)
			.expect(403)
			.end(function(tallySaveErr, tallySaveRes) {
				// Call the assertion callback
				done(tallySaveErr);
			});
	});

	it('should not be able to save Tally instance if no name is provided', function(done) {
		// Invalidate name field
		tally.name = '';

		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tally
				agent.post('/api/tallies')
					.send(tally)
					.expect(400)
					.end(function(tallySaveErr, tallySaveRes) {
						// Set message assertion
						(tallySaveRes.body.message).should.match('Please fill Tally name');
						
						// Handle Tally save error
						done(tallySaveErr);
					});
			});
	});

	it('should be able to update Tally instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tally
				agent.post('/api/tallies')
					.send(tally)
					.expect(200)
					.end(function(tallySaveErr, tallySaveRes) {
						// Handle Tally save error
						if (tallySaveErr) done(tallySaveErr);

						// Update Tally name
						tally.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Tally
						agent.put('/api/tallies/' + tallySaveRes.body._id)
							.send(tally)
							.expect(200)
							.end(function(tallyUpdateErr, tallyUpdateRes) {
								// Handle Tally update error
								if (tallyUpdateErr) done(tallyUpdateErr);

								// Set assertions
								(tallyUpdateRes.body._id).should.equal(tallySaveRes.body._id);
								(tallyUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Tallies if not signed in', function(done) {
		// Create new Tally model instance
		var tallyObj = new Tally(tally);

		// Save the Tally
		tallyObj.save(function() {
			// Request Tallies
			request(app).get('/api/tallies')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Tally if not signed in', function(done) {
		// Create new Tally model instance
		var tallyObj = new Tally(tally);

		// Save the Tally
		tallyObj.save(function() {
			request(app).get('/api/tallies/' + tallyObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', tally.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Tally instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tally
				agent.post('/api/tallies')
					.send(tally)
					.expect(200)
					.end(function(tallySaveErr, tallySaveRes) {
						// Handle Tally save error
						if (tallySaveErr) done(tallySaveErr);

						// Delete existing Tally
						agent.delete('/api/tallies/' + tallySaveRes.body._id)
							.send(tally)
							.expect(200)
							.end(function(tallyDeleteErr, tallyDeleteRes) {
								// Handle Tally error error
								if (tallyDeleteErr) done(tallyDeleteErr);

								// Set assertions
								(tallyDeleteRes.body._id).should.equal(tallySaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Tally instance if not signed in', function(done) {
		// Set Tally user 
		tally.user = user;

		// Create new Tally model instance
		var tallyObj = new Tally(tally);

		// Save the Tally
		tallyObj.save(function() {
			// Try deleting Tally
			request(app).delete('/api/tallies/' + tallyObj._id)
			.expect(403)
			.end(function(tallyDeleteErr, tallyDeleteRes) {
				// Set message assertion
				(tallyDeleteRes.body.message).should.match('User is not authorized');

				// Handle Tally error error
				done(tallyDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			Tally.remove().exec(function(){
				done();
			});
		});
	});
});
