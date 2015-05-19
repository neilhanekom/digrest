'use strict';

// Compartments controller
angular.module('compartments').controller('CompartmentsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Compartments', 'Suppliers', 'Plantations', '$mdDialog', '$timeout',
	function($scope, $stateParams, $location, Authentication, Compartments, Suppliers, Plantations, $mdDialog, $timeout ) {
		$scope.authentication = Authentication;

		$scope.selSupplier = [];
		$scope.selPlants = [];


		$scope.addSuppplier = function(supl) {
			var selSupLength = $scope.selSupplier.length;
			if (selSupLength > 0 ) {
				$scope.selSupplier.splice(0, selSupLength, supl);
				
			} else {
				$scope.selSupplier.push(supl);
			}

			$scope.addPlants(supl);
		};

		$scope.addPlants = function(supl) {
			var id = supl._id;
			var values = Plantations.query();
			var lengthSelPlants = $scope.selPlants.length;
			if (lengthSelPlants > 0 ) {
				$scope.selPlants.splice(0, lengthSelPlants);
			}

			$timeout(function(){
				angular.forEach(values, function(value, key) {
				  if (value.supplier === id) {
				  	$scope.selPlants.push(value);
				  }
				});
				
			}, 500);


			
		};

		$scope.loadSuppliers = function() {
			$scope.suppliers = Suppliers.query();
		};

		 
		// Create new Compartment
		$scope.create = function() {
			// Create new Compartment object
			var compartment = new Compartments ({
				name: this.name,
				supplier: $scope.supplier,
				plantation: $scope.plantation
			});

			
			//Redirect after save
			compartment.$save(function(response) {
				$location.path('compartments/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Compartment
		$scope.remove = function( compartment ) {
			if ( compartment ) { compartment.$remove();

				for (var i in $scope.compartments ) {
					if ($scope.compartments [i] === compartment ) {
						$scope.compartments.splice(i, 1);
					}
				}
			} else {
				$scope.compartment.$remove(function() {
					$location.path('compartments');
				});
			}
		};

		// Update existing Compartment
		$scope.update = function() {
			var compartment = $scope.compartment ;

			compartment.$update(function() {
				$location.path('compartments/' + compartment._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Compartments
		$scope.find = function() {
			$scope.compartments = Compartments.query();
		};

		// Find existing Compartment
		$scope.findOne = function() {
			$scope.compartment = Compartments.get({ 
				compartmentId: $stateParams.compartmentId
			});
		};
	}
]);