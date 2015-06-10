'use strict';

// Compartments controller
angular.module('compartments').controller('CompartmentsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Compartments', 'Suppliers', 'Plantations', '$mdDialog', '$timeout',
	function($scope, $stateParams, $location, Authentication, Compartments, Suppliers, Plantations, $mdDialog, $timeout ) {
		$scope.authentication = Authentication;

		$scope.selSupplier = [];
		$scope.selPlants = [];


		$scope.addSuppplier = function(supl) {
			
			$timeout(function(){
				$scope.supplier = supl;
			}, 500);
			// var selSupLength = $scope.selSupplier.length;
			// if (selSupLength > 0 ) {
			// 	$scope.selSupplier.splice(0, selSupLength, supl);
				
			// } else {
			// 	$scope.selSupplier.push(supl);
			// }

			// $scope.addPlants(supl); 
		};

		$scope.addPlantation = function(plantation) {
			console.log(plantation);
			$scope.plantation = Plantations.get({ 
				plantationId: plantation._id
			});
		};

		$scope.loadSuppliers = function() {
			$scope.suppliers = Suppliers.query();
		};

		 
		// Create new Compartment
		$scope.create = function() {
			// Create new Compartment object
			var compartment = new Compartments ({
				name: this.name,
				supplier: $scope.supplier._id,
				plantation: $scope.plantation._id
			});

			
			//Redirect after save
			compartment.$save(function(response) {
				$scope.plantation.compartments.push(response._id);

				var plantation = $scope.plantation;
				plantation.$update(function() {
					console.log("success");
				}, function(errorResponse) {
					$scope.error = errorResponse.data.message;
				});
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