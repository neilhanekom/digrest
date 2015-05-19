'use strict';

var should = require('should'),
	request = require('supertest'),
	path = require('path'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Placard = mongoose.model('Placard'),
	express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, placard;

/**
 * Placard routes tests
 */
describe('Placard CRUD tests', function() {
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

		// Save a user to the test db and create new Placard
		user.save(function() {
			placard = {
				name: 'Placard Name'
			};

			done();
		});
	});

	it('should be able to save Placard instance if logged in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Placard
				agent.post('/api/placards')
					.send(placard)
					.expect(200)
					.end(function(placardSaveErr, placardSaveRes) {
						// Handle Placard save error
						if (placardSaveErr) done(placardSaveErr);

						// Get a list of Placards
						agent.get('/api/placards')
							.end(function(placardsGetErr, placardsGetRes) {
								// Handle Placard save error
								if (placardsGetErr) done(placardsGetErr);

								// Get Placards list
								var placards = placardsGetRes.body;

								// Set assertions
								(placards[0].user._id).should.equal(userId);
								(placards[0].name).should.match('Placard Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Placard instance if not logged in', function(done) {
		agent.post('/api/placards')
			.send(placard)
			.expect(403)
			.end(function(placardSaveErr, placardSaveRes) {
				// Call the assertion callback
				done(placardSaveErr);
			});
	});

	it('should not be able to save Placard instance if no name is provided', function(done) {
		// Invalidate name field
		placard.name = '';

		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Placard
				agent.post('/api/placards')
					.send(placard)
					.expect(400)
					.end(function(placardSaveErr, placardSaveRes) {
						// Set message assertion
						(placardSaveRes.body.message).should.match('Please fill Placard name');
						
						// Handle Placard save error
						done(placardSaveErr);
					});
			});
	});

	it('should be able to update Placard instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Placard
				agent.post('/api/placards')
					.send(placard)
					.expect(200)
					.end(function(placardSaveErr, placardSaveRes) {
						// Handle Placard save error
						if (placardSaveErr) done(placardSaveErr);

						// Update Placard name
						placard.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Placard
						agent.put('/api/placards/' + placardSaveRes.body._id)
							.send(placard)
							.expect(200)
							.end(function(placardUpdateErr, placardUpdateRes) {
								// Handle Placard update error
								if (placardUpdateErr) done(placardUpdateErr);

								// Set assertions
								(placardUpdateRes.body._id).should.equal(placardSaveRes.body._id);
								(placardUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Placards if not signed in', function(done) {
		// Create new Placard model instance
		var placardObj = new Placard(placard);

		// Save the Placard
		placardObj.save(function() {
			// Request Placards
			request(app).get('/api/placards')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Placard if not signed in', function(done) {
		// Create new Placard model instance
		var placardObj = new Placard(placard);

		// Save the Placard
		placardObj.save(function() {
			request(app).get('/api/placards/' + placardObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', placard.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Placard instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Placard
				agent.post('/api/placards')
					.send(placard)
					.expect(200)
					.end(function(placardSaveErr, placardSaveRes) {
						// Handle Placard save error
						if (placardSaveErr) done(placardSaveErr);

						// Delete existing Placard
						agent.delete('/api/placards/' + placardSaveRes.body._id)
							.send(placard)
							.expect(200)
							.end(function(placardDeleteErr, placardDeleteRes) {
								// Handle Placard error error
								if (placardDeleteErr) done(placardDeleteErr);

								// Set assertions
								(placardDeleteRes.body._id).should.equal(placardSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Placard instance if not signed in', function(done) {
		// Set Placard user 
		placard.user = user;

		// Create new Placard model instance
		var placardObj = new Placard(placard);

		// Save the Placard
		placardObj.save(function() {
			// Try deleting Placard
			request(app).delete('/api/placards/' + placardObj._id)
			.expect(403)
			.end(function(placardDeleteErr, placardDeleteRes) {
				// Set message assertion
				(placardDeleteRes.body.message).should.match('User is not authorized');

				// Handle Placard error error
				done(placardDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			Placard.remove().exec(function(){
				done();
			});
		});
	});
});
