'use strict';

var should = require('should'),
	request = require('supertest'),
	path = require('path'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Enumeration = mongoose.model('Enumeration'),
	express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, enumeration;

/**
 * Enumeration routes tests
 */
describe('Enumeration CRUD tests', function() {
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

		// Save a user to the test db and create new Enumeration
		user.save(function() {
			enumeration = {
				name: 'Enumeration Name'
			};

			done();
		});
	});

	it('should be able to save Enumeration instance if logged in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Enumeration
				agent.post('/api/enumerations')
					.send(enumeration)
					.expect(200)
					.end(function(enumerationSaveErr, enumerationSaveRes) {
						// Handle Enumeration save error
						if (enumerationSaveErr) done(enumerationSaveErr);

						// Get a list of Enumerations
						agent.get('/api/enumerations')
							.end(function(enumerationsGetErr, enumerationsGetRes) {
								// Handle Enumeration save error
								if (enumerationsGetErr) done(enumerationsGetErr);

								// Get Enumerations list
								var enumerations = enumerationsGetRes.body;

								// Set assertions
								(enumerations[0].user._id).should.equal(userId);
								(enumerations[0].name).should.match('Enumeration Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Enumeration instance if not logged in', function(done) {
		agent.post('/api/enumerations')
			.send(enumeration)
			.expect(403)
			.end(function(enumerationSaveErr, enumerationSaveRes) {
				// Call the assertion callback
				done(enumerationSaveErr);
			});
	});

	it('should not be able to save Enumeration instance if no name is provided', function(done) {
		// Invalidate name field
		enumeration.name = '';

		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Enumeration
				agent.post('/api/enumerations')
					.send(enumeration)
					.expect(400)
					.end(function(enumerationSaveErr, enumerationSaveRes) {
						// Set message assertion
						(enumerationSaveRes.body.message).should.match('Please fill Enumeration name');
						
						// Handle Enumeration save error
						done(enumerationSaveErr);
					});
			});
	});

	it('should be able to update Enumeration instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Enumeration
				agent.post('/api/enumerations')
					.send(enumeration)
					.expect(200)
					.end(function(enumerationSaveErr, enumerationSaveRes) {
						// Handle Enumeration save error
						if (enumerationSaveErr) done(enumerationSaveErr);

						// Update Enumeration name
						enumeration.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Enumeration
						agent.put('/api/enumerations/' + enumerationSaveRes.body._id)
							.send(enumeration)
							.expect(200)
							.end(function(enumerationUpdateErr, enumerationUpdateRes) {
								// Handle Enumeration update error
								if (enumerationUpdateErr) done(enumerationUpdateErr);

								// Set assertions
								(enumerationUpdateRes.body._id).should.equal(enumerationSaveRes.body._id);
								(enumerationUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Enumerations if not signed in', function(done) {
		// Create new Enumeration model instance
		var enumerationObj = new Enumeration(enumeration);

		// Save the Enumeration
		enumerationObj.save(function() {
			// Request Enumerations
			request(app).get('/api/enumerations')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Enumeration if not signed in', function(done) {
		// Create new Enumeration model instance
		var enumerationObj = new Enumeration(enumeration);

		// Save the Enumeration
		enumerationObj.save(function() {
			request(app).get('/api/enumerations/' + enumerationObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', enumeration.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Enumeration instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Enumeration
				agent.post('/api/enumerations')
					.send(enumeration)
					.expect(200)
					.end(function(enumerationSaveErr, enumerationSaveRes) {
						// Handle Enumeration save error
						if (enumerationSaveErr) done(enumerationSaveErr);

						// Delete existing Enumeration
						agent.delete('/api/enumerations/' + enumerationSaveRes.body._id)
							.send(enumeration)
							.expect(200)
							.end(function(enumerationDeleteErr, enumerationDeleteRes) {
								// Handle Enumeration error error
								if (enumerationDeleteErr) done(enumerationDeleteErr);

								// Set assertions
								(enumerationDeleteRes.body._id).should.equal(enumerationSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Enumeration instance if not signed in', function(done) {
		// Set Enumeration user 
		enumeration.user = user;

		// Create new Enumeration model instance
		var enumerationObj = new Enumeration(enumeration);

		// Save the Enumeration
		enumerationObj.save(function() {
			// Try deleting Enumeration
			request(app).delete('/api/enumerations/' + enumerationObj._id)
			.expect(403)
			.end(function(enumerationDeleteErr, enumerationDeleteRes) {
				// Set message assertion
				(enumerationDeleteRes.body.message).should.match('User is not authorized');

				// Handle Enumeration error error
				done(enumerationDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			Enumeration.remove().exec(function(){
				done();
			});
		});
	});
});
