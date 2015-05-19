'use strict';

(function() {
	// Compartments Controller Spec
	describe('Compartments Controller Tests', function() {
		// Initialize global variables
		var CompartmentsController,
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

			// Initialize the Compartments controller.
			CompartmentsController = $controller('CompartmentsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Compartment object fetched from XHR', inject(function(Compartments) {
			// Create sample Compartment using the Compartments service
			var sampleCompartment = new Compartments({
				name: 'New Compartment'
			});

			// Create a sample Compartments array that includes the new Compartment
			var sampleCompartments = [sampleCompartment];

			// Set GET response
			$httpBackend.expectGET('api/compartments').respond(sampleCompartments);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.compartments).toEqualData(sampleCompartments);
		}));

		it('$scope.findOne() should create an array with one Compartment object fetched from XHR using a compartmentId URL parameter', inject(function(Compartments) {
			// Define a sample Compartment object
			var sampleCompartment = new Compartments({
				name: 'New Compartment'
			});

			// Set the URL parameter
			$stateParams.compartmentId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/api\/compartments\/([0-9a-fA-F]{24})$/).respond(sampleCompartment);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.compartment).toEqualData(sampleCompartment);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Compartments) {
			// Create a sample Compartment object
			var sampleCompartmentPostData = new Compartments({
				name: 'New Compartment'
			});

			// Create a sample Compartment response
			var sampleCompartmentResponse = new Compartments({
				_id: '525cf20451979dea2c000001',
				name: 'New Compartment'
			});

			// Fixture mock form input values
			scope.name = 'New Compartment';

			// Set POST response
			$httpBackend.expectPOST('api/compartments', sampleCompartmentPostData).respond(sampleCompartmentResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Compartment was created
			expect($location.path()).toBe('/compartments/' + sampleCompartmentResponse._id);
		}));

		it('$scope.update() should update a valid Compartment', inject(function(Compartments) {
			// Define a sample Compartment put data
			var sampleCompartmentPutData = new Compartments({
				_id: '525cf20451979dea2c000001',
				name: 'New Compartment'
			});

			// Mock Compartment in scope
			scope.compartment = sampleCompartmentPutData;

			// Set PUT response
			$httpBackend.expectPUT(/api\/compartments\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/compartments/' + sampleCompartmentPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid compartmentId and remove the Compartment from the scope', inject(function(Compartments) {
			// Create new Compartment object
			var sampleCompartment = new Compartments({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Compartments array and include the Compartment
			scope.compartments = [sampleCompartment];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/api\/compartments\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleCompartment);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.compartments.length).toBe(0);
		}));
	});
}());