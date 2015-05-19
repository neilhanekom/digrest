'use strict';

(function() {
	// Placards Controller Spec
	describe('Placards Controller Tests', function() {
		// Initialize global variables
		var PlacardsController,
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

			// Initialize the Placards controller.
			PlacardsController = $controller('PlacardsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Placard object fetched from XHR', inject(function(Placards) {
			// Create sample Placard using the Placards service
			var samplePlacard = new Placards({
				name: 'New Placard'
			});

			// Create a sample Placards array that includes the new Placard
			var samplePlacards = [samplePlacard];

			// Set GET response
			$httpBackend.expectGET('api/placards').respond(samplePlacards);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.placards).toEqualData(samplePlacards);
		}));

		it('$scope.findOne() should create an array with one Placard object fetched from XHR using a placardId URL parameter', inject(function(Placards) {
			// Define a sample Placard object
			var samplePlacard = new Placards({
				name: 'New Placard'
			});

			// Set the URL parameter
			$stateParams.placardId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/api\/placards\/([0-9a-fA-F]{24})$/).respond(samplePlacard);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.placard).toEqualData(samplePlacard);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Placards) {
			// Create a sample Placard object
			var samplePlacardPostData = new Placards({
				name: 'New Placard'
			});

			// Create a sample Placard response
			var samplePlacardResponse = new Placards({
				_id: '525cf20451979dea2c000001',
				name: 'New Placard'
			});

			// Fixture mock form input values
			scope.name = 'New Placard';

			// Set POST response
			$httpBackend.expectPOST('api/placards', samplePlacardPostData).respond(samplePlacardResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Placard was created
			expect($location.path()).toBe('/placards/' + samplePlacardResponse._id);
		}));

		it('$scope.update() should update a valid Placard', inject(function(Placards) {
			// Define a sample Placard put data
			var samplePlacardPutData = new Placards({
				_id: '525cf20451979dea2c000001',
				name: 'New Placard'
			});

			// Mock Placard in scope
			scope.placard = samplePlacardPutData;

			// Set PUT response
			$httpBackend.expectPUT(/api\/placards\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/placards/' + samplePlacardPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid placardId and remove the Placard from the scope', inject(function(Placards) {
			// Create new Placard object
			var samplePlacard = new Placards({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Placards array and include the Placard
			scope.placards = [samplePlacard];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/api\/placards\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePlacard);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.placards.length).toBe(0);
		}));
	});
}());