'use strict';

var should = require('should'),
	request = require('supertest'),
	path = require('path'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Plantation = mongoose.model('Plantation'),
	express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, plantation;

/**
 * Plantation routes tests
 */
describe('Plantation CRUD tests', function() {
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

		// Save a user to the test db and create new Plantation
		user.save(function() {
			plantation = {
				name: 'Plantation Name'
			};

			done();
		});
	});

	it('should be able to save Plantation instance if logged in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Plantation
				agent.post('/api/plantations')
					.send(plantation)
					.expect(200)
					.end(function(plantationSaveErr, plantationSaveRes) {
						// Handle Plantation save error
						if (plantationSaveErr) done(plantationSaveErr);

						// Get a list of Plantations
						agent.get('/api/plantations')
							.end(function(plantationsGetErr, plantationsGetRes) {
								// Handle Plantation save error
								if (plantationsGetErr) done(plantationsGetErr);

								// Get Plantations list
								var plantations = plantationsGetRes.body;

								// Set assertions
								(plantations[0].user._id).should.equal(userId);
								(plantations[0].name).should.match('Plantation Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Plantation instance if not logged in', function(done) {
		agent.post('/api/plantations')
			.send(plantation)
			.expect(403)
			.end(function(plantationSaveErr, plantationSaveRes) {
				// Call the assertion callback
				done(plantationSaveErr);
			});
	});

	it('should not be able to save Plantation instance if no name is provided', function(done) {
		// Invalidate name field
		plantation.name = '';

		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Plantation
				agent.post('/api/plantations')
					.send(plantation)
					.expect(400)
					.end(function(plantationSaveErr, plantationSaveRes) {
						// Set message assertion
						(plantationSaveRes.body.message).should.match('Please fill Plantation name');
						
						// Handle Plantation save error
						done(plantationSaveErr);
					});
			});
	});

	it('should be able to update Plantation instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Plantation
				agent.post('/api/plantations')
					.send(plantation)
					.expect(200)
					.end(function(plantationSaveErr, plantationSaveRes) {
						// Handle Plantation save error
						if (plantationSaveErr) done(plantationSaveErr);

						// Update Plantation name
						plantation.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Plantation
						agent.put('/api/plantations/' + plantationSaveRes.body._id)
							.send(plantation)
							.expect(200)
							.end(function(plantationUpdateErr, plantationUpdateRes) {
								// Handle Plantation update error
								if (plantationUpdateErr) done(plantationUpdateErr);

								// Set assertions
								(plantationUpdateRes.body._id).should.equal(plantationSaveRes.body._id);
								(plantationUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Plantations if not signed in', function(done) {
		// Create new Plantation model instance
		var plantationObj = new Plantation(plantation);

		// Save the Plantation
		plantationObj.save(function() {
			// Request Plantations
			request(app).get('/api/plantations')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Plantation if not signed in', function(done) {
		// Create new Plantation model instance
		var plantationObj = new Plantation(plantation);

		// Save the Plantation
		plantationObj.save(function() {
			request(app).get('/api/plantations/' + plantationObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', plantation.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Plantation instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Plantation
				agent.post('/api/plantations')
					.send(plantation)
					.expect(200)
					.end(function(plantationSaveErr, plantationSaveRes) {
						// Handle Plantation save error
						if (plantationSaveErr) done(plantationSaveErr);

						// Delete existing Plantation
						agent.delete('/api/plantations/' + plantationSaveRes.body._id)
							.send(plantation)
							.expect(200)
							.end(function(plantationDeleteErr, plantationDeleteRes) {
								// Handle Plantation error error
								if (plantationDeleteErr) done(plantationDeleteErr);

								// Set assertions
								(plantationDeleteRes.body._id).should.equal(plantationSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Plantation instance if not signed in', function(done) {
		// Set Plantation user 
		plantation.user = user;

		// Create new Plantation model instance
		var plantationObj = new Plantation(plantation);

		// Save the Plantation
		plantationObj.save(function() {
			// Try deleting Plantation
			request(app).delete('/api/plantations/' + plantationObj._id)
			.expect(403)
			.end(function(plantationDeleteErr, plantationDeleteRes) {
				// Set message assertion
				(plantationDeleteRes.body.message).should.match('User is not authorized');

				// Handle Plantation error error
				done(plantationDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			Plantation.remove().exec(function(){
				done();
			});
		});
	});
});
