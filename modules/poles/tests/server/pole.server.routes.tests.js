'use strict';

var should = require('should'),
	request = require('supertest'),
	path = require('path'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Pole = mongoose.model('Pole'),
	express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, pole;

/**
 * Pole routes tests
 */
describe('Pole CRUD tests', function() {
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

		// Save a user to the test db and create new Pole
		user.save(function() {
			pole = {
				name: 'Pole Name'
			};

			done();
		});
	});

	it('should be able to save Pole instance if logged in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Pole
				agent.post('/api/poles')
					.send(pole)
					.expect(200)
					.end(function(poleSaveErr, poleSaveRes) {
						// Handle Pole save error
						if (poleSaveErr) done(poleSaveErr);

						// Get a list of Poles
						agent.get('/api/poles')
							.end(function(polesGetErr, polesGetRes) {
								// Handle Pole save error
								if (polesGetErr) done(polesGetErr);

								// Get Poles list
								var poles = polesGetRes.body;

								// Set assertions
								(poles[0].user._id).should.equal(userId);
								(poles[0].name).should.match('Pole Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Pole instance if not logged in', function(done) {
		agent.post('/api/poles')
			.send(pole)
			.expect(403)
			.end(function(poleSaveErr, poleSaveRes) {
				// Call the assertion callback
				done(poleSaveErr);
			});
	});

	it('should not be able to save Pole instance if no name is provided', function(done) {
		// Invalidate name field
		pole.name = '';

		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Pole
				agent.post('/api/poles')
					.send(pole)
					.expect(400)
					.end(function(poleSaveErr, poleSaveRes) {
						// Set message assertion
						(poleSaveRes.body.message).should.match('Please fill Pole name');
						
						// Handle Pole save error
						done(poleSaveErr);
					});
			});
	});

	it('should be able to update Pole instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Pole
				agent.post('/api/poles')
					.send(pole)
					.expect(200)
					.end(function(poleSaveErr, poleSaveRes) {
						// Handle Pole save error
						if (poleSaveErr) done(poleSaveErr);

						// Update Pole name
						pole.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Pole
						agent.put('/api/poles/' + poleSaveRes.body._id)
							.send(pole)
							.expect(200)
							.end(function(poleUpdateErr, poleUpdateRes) {
								// Handle Pole update error
								if (poleUpdateErr) done(poleUpdateErr);

								// Set assertions
								(poleUpdateRes.body._id).should.equal(poleSaveRes.body._id);
								(poleUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Poles if not signed in', function(done) {
		// Create new Pole model instance
		var poleObj = new Pole(pole);

		// Save the Pole
		poleObj.save(function() {
			// Request Poles
			request(app).get('/api/poles')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Pole if not signed in', function(done) {
		// Create new Pole model instance
		var poleObj = new Pole(pole);

		// Save the Pole
		poleObj.save(function() {
			request(app).get('/api/poles/' + poleObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', pole.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Pole instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Pole
				agent.post('/api/poles')
					.send(pole)
					.expect(200)
					.end(function(poleSaveErr, poleSaveRes) {
						// Handle Pole save error
						if (poleSaveErr) done(poleSaveErr);

						// Delete existing Pole
						agent.delete('/api/poles/' + poleSaveRes.body._id)
							.send(pole)
							.expect(200)
							.end(function(poleDeleteErr, poleDeleteRes) {
								// Handle Pole error error
								if (poleDeleteErr) done(poleDeleteErr);

								// Set assertions
								(poleDeleteRes.body._id).should.equal(poleSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Pole instance if not signed in', function(done) {
		// Set Pole user 
		pole.user = user;

		// Create new Pole model instance
		var poleObj = new Pole(pole);

		// Save the Pole
		poleObj.save(function() {
			// Try deleting Pole
			request(app).delete('/api/poles/' + poleObj._id)
			.expect(403)
			.end(function(poleDeleteErr, poleDeleteRes) {
				// Set message assertion
				(poleDeleteRes.body.message).should.match('User is not authorized');

				// Handle Pole error error
				done(poleDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			Pole.remove().exec(function(){
				done();
			});
		});
	});
});
