'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Enumeration = mongoose.model('Enumeration');

/**
 * Globals
 */
var user, enumeration;

/**
 * Unit tests
 */
describe('Enumeration Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			enumeration = new Enumeration({
				name: 'Enumeration Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return enumeration.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			enumeration.name = '';

			return enumeration.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Enumeration.remove().exec(function(){
			User.remove().exec(function(){
				done();
			});	
		});
	});
});
