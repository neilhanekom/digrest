'use strict';

// Plantations controller
angular.module('plantations').controller('PlantationsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Plantations', '$timeout', 'Suppliers',
	function($scope, $stateParams, $location, Authentication, Plantations, $timeout, Suppliers ) {
		$scope.authentication = Authentication;


		// select options
		$scope.loadSuppliers = function() {
			return $timeout(function(){
				$scope.suppliers = Suppliers.query();
			}, 650);
		};


		// Create new Plantation
		$scope.create = function() {
			// Create new Plantation object
			// We First need to create a new Plantation
			// Then we need to take the id of this plantation and update the Supplier.

			var plantation = new Plantations ({
				name: this.name,
				supplier: $scope.supplier._id
			});

			// Redirect after save
			plantation.$save(function(response) {
				// $location.path('plantations/' + response._id);
				$scope.supplier.plantations.push(response._id);
				var supplier = $scope.supplier;
				console.log(supplier);
				supplier.$update(function(response) {
					console.log('success');
				}), function(errorResponse) {
					console.log(errorResponse)
					// $scope.error = errorResponse.data.message;
				};
				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Plantation
		$scope.remove = function( plantation ) {
			if ( plantation ) { plantation.$remove();

				for (var i in $scope.plantations ) {
					if ($scope.plantations [i] === plantation ) {
						$scope.plantations.splice(i, 1);
					}
				}
			} else {
				$scope.plantation.$remove(function() {
					$location.path('plantations');
				});
			}
		};

		// Update existing Plantation
		$scope.update = function() {
			var plantation = $scope.plantation ;

			plantation.$update(function() {
				$location.path('plantations/' + plantation._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Plantations
		$scope.find = function() {
			$scope.plantations = Plantations.query();
		};

		// Find existing Plantation
		$scope.findOne = function() {
			$scope.plantation = Plantations.get({ 
				plantationId: $stateParams.plantationId
			});
		};
	}
]);