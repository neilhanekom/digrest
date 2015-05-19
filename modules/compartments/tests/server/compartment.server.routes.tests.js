'use strict';

var should = require('should'),
	request = require('supertest'),
	path = require('path'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Compartment = mongoose.model('Compartment'),
	express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, compartment;

/**
 * Compartment routes tests
 */
describe('Compartment CRUD tests', function() {
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

		// Save a user to the test db and create new Compartment
		user.save(function() {
			compartment = {
				name: 'Compartment Name'
			};

			done();
		});
	});

	it('should be able to save Compartment instance if logged in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Compartment
				agent.post('/api/compartments')
					.send(compartment)
					.expect(200)
					.end(function(compartmentSaveErr, compartmentSaveRes) {
						// Handle Compartment save error
						if (compartmentSaveErr) done(compartmentSaveErr);

						// Get a list of Compartments
						agent.get('/api/compartments')
							.end(function(compartmentsGetErr, compartmentsGetRes) {
								// Handle Compartment save error
								if (compartmentsGetErr) done(compartmentsGetErr);

								// Get Compartments list
								var compartments = compartmentsGetRes.body;

								// Set assertions
								(compartments[0].user._id).should.equal(userId);
								(compartments[0].name).should.match('Compartment Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Compartment instance if not logged in', function(done) {
		agent.post('/api/compartments')
			.send(compartment)
			.expect(403)
			.end(function(compartmentSaveErr, compartmentSaveRes) {
				// Call the assertion callback
				done(compartmentSaveErr);
			});
	});

	it('should not be able to save Compartment instance if no name is provided', function(done) {
		// Invalidate name field
		compartment.name = '';

		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Compartment
				agent.post('/api/compartments')
					.send(compartment)
					.expect(400)
					.end(function(compartmentSaveErr, compartmentSaveRes) {
						// Set message assertion
						(compartmentSaveRes.body.message).should.match('Please fill Compartment name');
						
						// Handle Compartment save error
						done(compartmentSaveErr);
					});
			});
	});

	it('should be able to update Compartment instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Compartment
				agent.post('/api/compartments')
					.send(compartment)
					.expect(200)
					.end(function(compartmentSaveErr, compartmentSaveRes) {
						// Handle Compartment save error
						if (compartmentSaveErr) done(compartmentSaveErr);

						// Update Compartment name
						compartment.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Compartment
						agent.put('/api/compartments/' + compartmentSaveRes.body._id)
							.send(compartment)
							.expect(200)
							.end(function(compartmentUpdateErr, compartmentUpdateRes) {
								// Handle Compartment update error
								if (compartmentUpdateErr) done(compartmentUpdateErr);

								// Set assertions
								(compartmentUpdateRes.body._id).should.equal(compartmentSaveRes.body._id);
								(compartmentUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Compartments if not signed in', function(done) {
		// Create new Compartment model instance
		var compartmentObj = new Compartment(compartment);

		// Save the Compartment
		compartmentObj.save(function() {
			// Request Compartments
			request(app).get('/api/compartments')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Compartment if not signed in', function(done) {
		// Create new Compartment model instance
		var compartmentObj = new Compartment(compartment);

		// Save the Compartment
		compartmentObj.save(function() {
			request(app).get('/api/compartments/' + compartmentObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', compartment.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Compartment instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Compartment
				agent.post('/api/compartments')
					.send(compartment)
					.expect(200)
					.end(function(compartmentSaveErr, compartmentSaveRes) {
						// Handle Compartment save error
						if (compartmentSaveErr) done(compartmentSaveErr);

						// Delete existing Compartment
						agent.delete('/api/compartments/' + compartmentSaveRes.body._id)
							.send(compartment)
							.expect(200)
							.end(function(compartmentDeleteErr, compartmentDeleteRes) {
								// Handle Compartment error error
								if (compartmentDeleteErr) done(compartmentDeleteErr);

								// Set assertions
								(compartmentDeleteRes.body._id).should.equal(compartmentSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Compartment instance if not signed in', function(done) {
		// Set Compartment user 
		compartment.user = user;

		// Create new Compartment model instance
		var compartmentObj = new Compartment(compartment);

		// Save the Compartment
		compartmentObj.save(function() {
			// Try deleting Compartment
			request(app).delete('/api/compartments/' + compartmentObj._id)
			.expect(403)
			.end(function(compartmentDeleteErr, compartmentDeleteRes) {
				// Set message assertion
				(compartmentDeleteRes.body.message).should.match('User is not authorized');

				// Handle Compartment error error
				done(compartmentDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			Compartment.remove().exec(function(){
				done();
			});
		});
	});
});
