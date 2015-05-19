'use strict';

(function() {
	// Plantations Controller Spec
	describe('Plantations Controller Tests', function() {
		// Initialize global variables
		var PlantationsController,
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

			// Initialize the Plantations controller.
			PlantationsController = $controller('PlantationsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Plantation object fetched from XHR', inject(function(Plantations) {
			// Create sample Plantation using the Plantations service
			var samplePlantation = new Plantations({
				name: 'New Plantation'
			});

			// Create a sample Plantations array that includes the new Plantation
			var samplePlantations = [samplePlantation];

			// Set GET response
			$httpBackend.expectGET('api/plantations').respond(samplePlantations);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.plantations).toEqualData(samplePlantations);
		}));

		it('$scope.findOne() should create an array with one Plantation object fetched from XHR using a plantationId URL parameter', inject(function(Plantations) {
			// Define a sample Plantation object
			var samplePlantation = new Plantations({
				name: 'New Plantation'
			});

			// Set the URL parameter
			$stateParams.plantationId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/api\/plantations\/([0-9a-fA-F]{24})$/).respond(samplePlantation);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.plantation).toEqualData(samplePlantation);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Plantations) {
			// Create a sample Plantation object
			var samplePlantationPostData = new Plantations({
				name: 'New Plantation'
			});

			// Create a sample Plantation response
			var samplePlantationResponse = new Plantations({
				_id: '525cf20451979dea2c000001',
				name: 'New Plantation'
			});

			// Fixture mock form input values
			scope.name = 'New Plantation';

			// Set POST response
			$httpBackend.expectPOST('api/plantations', samplePlantationPostData).respond(samplePlantationResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Plantation was created
			expect($location.path()).toBe('/plantations/' + samplePlantationResponse._id);
		}));

		it('$scope.update() should update a valid Plantation', inject(function(Plantations) {
			// Define a sample Plantation put data
			var samplePlantationPutData = new Plantations({
				_id: '525cf20451979dea2c000001',
				name: 'New Plantation'
			});

			// Mock Plantation in scope
			scope.plantation = samplePlantationPutData;

			// Set PUT response
			$httpBackend.expectPUT(/api\/plantations\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/plantations/' + samplePlantationPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid plantationId and remove the Plantation from the scope', inject(function(Plantations) {
			// Create new Plantation object
			var samplePlantation = new Plantations({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Plantations array and include the Plantation
			scope.plantations = [samplePlantation];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/api\/plantations\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePlantation);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.plantations.length).toBe(0);
		}));
	});
}());