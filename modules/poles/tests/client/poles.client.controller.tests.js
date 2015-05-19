'use strict';

(function() {
	// Poles Controller Spec
	describe('Poles Controller Tests', function() {
		// Initialize global variables
		var PolesController,
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

			// Initialize the Poles controller.
			PolesController = $controller('PolesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Pole object fetched from XHR', inject(function(Poles) {
			// Create sample Pole using the Poles service
			var samplePole = new Poles({
				name: 'New Pole'
			});

			// Create a sample Poles array that includes the new Pole
			var samplePoles = [samplePole];

			// Set GET response
			$httpBackend.expectGET('api/poles').respond(samplePoles);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.poles).toEqualData(samplePoles);
		}));

		it('$scope.findOne() should create an array with one Pole object fetched from XHR using a poleId URL parameter', inject(function(Poles) {
			// Define a sample Pole object
			var samplePole = new Poles({
				name: 'New Pole'
			});

			// Set the URL parameter
			$stateParams.poleId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/api\/poles\/([0-9a-fA-F]{24})$/).respond(samplePole);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.pole).toEqualData(samplePole);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Poles) {
			// Create a sample Pole object
			var samplePolePostData = new Poles({
				name: 'New Pole'
			});

			// Create a sample Pole response
			var samplePoleResponse = new Poles({
				_id: '525cf20451979dea2c000001',
				name: 'New Pole'
			});

			// Fixture mock form input values
			scope.name = 'New Pole';

			// Set POST response
			$httpBackend.expectPOST('api/poles', samplePolePostData).respond(samplePoleResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Pole was created
			expect($location.path()).toBe('/poles/' + samplePoleResponse._id);
		}));

		it('$scope.update() should update a valid Pole', inject(function(Poles) {
			// Define a sample Pole put data
			var samplePolePutData = new Poles({
				_id: '525cf20451979dea2c000001',
				name: 'New Pole'
			});

			// Mock Pole in scope
			scope.pole = samplePolePutData;

			// Set PUT response
			$httpBackend.expectPUT(/api\/poles\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/poles/' + samplePolePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid poleId and remove the Pole from the scope', inject(function(Poles) {
			// Create new Pole object
			var samplePole = new Poles({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Poles array and include the Pole
			scope.poles = [samplePole];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/api\/poles\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePole);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.poles.length).toBe(0);
		}));
	});
}());