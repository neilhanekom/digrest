'use strict';

(function() {
	// Tallies Controller Spec
	describe('Tallies Controller Tests', function() {
		// Initialize global variables
		var TalliesController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Tallies controller.
			TalliesController = $controller('TalliesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Tally object fetched from XHR', inject(function(Tallies) {
			// Create sample Tally using the Tallies service
			var sampleTally = new Tallies({
				name: 'New Tally'
			});

			// Create a sample Tallies array that includes the new Tally
			var sampleTallies = [sampleTally];

			// Set GET response
			$httpBackend.expectGET('api/tallies').respond(sampleTallies);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.tallies).toEqualData(sampleTallies);
		}));

		it('$scope.findOne() should create an array with one Tally object fetched from XHR using a tallyId URL parameter', inject(function(Tallies) {
			// Define a sample Tally object
			var sampleTally = new Tallies({
				name: 'New Tally'
			});

			// Set the URL parameter
			$stateParams.tallyId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/api\/tallies\/([0-9a-fA-F]{24})$/).respond(sampleTally);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.tally).toEqualData(sampleTally);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Tallies) {
			// Create a sample Tally object
			var sampleTallyPostData = new Tallies({
				name: 'New Tally'
			});

			// Create a sample Tally response
			var sampleTallyResponse = new Tallies({
				_id: '525cf20451979dea2c000001',
				name: 'New Tally'
			});

			// Fixture mock form input values
			scope.name = 'New Tally';

			// Set POST response
			$httpBackend.expectPOST('api/tallies', sampleTallyPostData).respond(sampleTallyResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Tally was created
			expect($location.path()).toBe('/tallies/' + sampleTallyResponse._id);
		}));

		it('$scope.update() should update a valid Tally', inject(function(Tallies) {
			// Define a sample Tally put data
			var sampleTallyPutData = new Tallies({
				_id: '525cf20451979dea2c000001',
				name: 'New Tally'
			});

			// Mock Tally in scope
			scope.tally = sampleTallyPutData;

			// Set PUT response
			$httpBackend.expectPUT(/api\/tallies\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/tallies/' + sampleTallyPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid tallyId and remove the Tally from the scope', inject(function(Tallies) {
			// Create new Tally object
			var sampleTally = new Tallies({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Tallies array and include the Tally
			scope.tallies = [sampleTally];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/api\/tallies\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleTally);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.tallies.length).toBe(0);
		}));
	});
}());