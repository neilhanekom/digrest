'use strict';

(function() {
	// Enumerations Controller Spec
	describe('Enumerations Controller Tests', function() {
		// Initialize global variables
		var EnumerationsController,
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

			// Initialize the Enumerations controller.
			EnumerationsController = $controller('EnumerationsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Enumeration object fetched from XHR', inject(function(Enumerations) {
			// Create sample Enumeration using the Enumerations service
			var sampleEnumeration = new Enumerations({
				name: 'New Enumeration'
			});

			// Create a sample Enumerations array that includes the new Enumeration
			var sampleEnumerations = [sampleEnumeration];

			// Set GET response
			$httpBackend.expectGET('api/enumerations').respond(sampleEnumerations);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.enumerations).toEqualData(sampleEnumerations);
		}));

		it('$scope.findOne() should create an array with one Enumeration object fetched from XHR using a enumerationId URL parameter', inject(function(Enumerations) {
			// Define a sample Enumeration object
			var sampleEnumeration = new Enumerations({
				name: 'New Enumeration'
			});

			// Set the URL parameter
			$stateParams.enumerationId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/api\/enumerations\/([0-9a-fA-F]{24})$/).respond(sampleEnumeration);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.enumeration).toEqualData(sampleEnumeration);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Enumerations) {
			// Create a sample Enumeration object
			var sampleEnumerationPostData = new Enumerations({
				name: 'New Enumeration'
			});

			// Create a sample Enumeration response
			var sampleEnumerationResponse = new Enumerations({
				_id: '525cf20451979dea2c000001',
				name: 'New Enumeration'
			});

			// Fixture mock form input values
			scope.name = 'New Enumeration';

			// Set POST response
			$httpBackend.expectPOST('api/enumerations', sampleEnumerationPostData).respond(sampleEnumerationResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Enumeration was created
			expect($location.path()).toBe('/enumerations/' + sampleEnumerationResponse._id);
		}));

		it('$scope.update() should update a valid Enumeration', inject(function(Enumerations) {
			// Define a sample Enumeration put data
			var sampleEnumerationPutData = new Enumerations({
				_id: '525cf20451979dea2c000001',
				name: 'New Enumeration'
			});

			// Mock Enumeration in scope
			scope.enumeration = sampleEnumerationPutData;

			// Set PUT response
			$httpBackend.expectPUT(/api\/enumerations\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/enumerations/' + sampleEnumerationPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid enumerationId and remove the Enumeration from the scope', inject(function(Enumerations) {
			// Create new Enumeration object
			var sampleEnumeration = new Enumerations({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Enumerations array and include the Enumeration
			scope.enumerations = [sampleEnumeration];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/api\/enumerations\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleEnumeration);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.enumerations.length).toBe(0);
		}));
	});
}());