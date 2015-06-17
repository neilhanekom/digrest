'use strict';

// Placards controller
angular.module('placards').controller('PlacardsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Compartments', 'Suppliers', 'Plantations', 'Placards', '$timeout',
	function($scope, $stateParams, $location, Authentication, Compartments, Suppliers, Plantations, Placards, $timeout ) {
		$scope.authentication = Authentication;

		$scope.selSupplier = [];
		$scope.selPlants = [];

		$scope.placards = [];

		

		$scope.addPlantation = function(plantation) {
			var plantation = Plantations.get({ 
				plantationId: plantation._id
			});

			$timeout(function(){
				$scope.plantation = plantation;
				
			}, 500);
		};

		$scope.addCompartment = function(compartment) {
			var compartment = Compartments.get({
				compartmentId: compartment._id
			});

			$timeout(function(){
				$scope.compartment = compartment;
				$scope.addPlacards(compartment);
			}, 500);
		};

		$scope.addPlacards = function(compartment) {
			angular.forEach(compartment.placards, function(placard){
				$scope.placards.push(placard.no);
			});
			$scope.newP = $scope.placards.length;

		};

		$scope.incNewPlacard = function() {
			var newVal = $scope.newP + 1;
			$scope.newP += 1;
			angular.forEach($scope.placards, function(item){
				if (item === newVal) {
					$scope.newP += 1;
				}

			});
			
		};

		$scope.decNewPlacard = function() {
			
			var minValue = 1;
			if ($scope.newP > minValue) {
				$scope.newP -= 1;
				angular.forEach($scope.placards, function(item){
					if (item === $scope.newP) {
						$scope.newP -= 1;
						if ($scope.newP < 0 ) {
							$scope.newP += 2;
						}
					}

				});
			} else if ($scope.newP === minValue) {
				$scope.newP = $scope.newP;
			}
			
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

		// Create new Placard
		$scope.create = function() {
			// Create new Placard object
			var placard = new Placards ({
				no: $scope.newP,
				supplier: $scope.supplier._id,
				plantation: $scope.plantation._id,
				compartment: $scope.compartment._id
			});

						// Redirect after save
			placard.$save(function(response) {
				// $location.path('placards/' + response._id);

				$scope.compartment.placards.push(response._id);
				var compartment = $scope.compartment;
				compartment.$update(function() {
					// $location.path('placards/' + placard._id);
				}, function(errorResponse) {
					$scope.error = errorResponse.data.message;
				});
				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Placard
		$scope.remove = function( placard ) {
			if ( placard ) { placard.$remove();

				for (var i in $scope.placards ) {
					if ($scope.placards [i] === placard ) {
						$scope.placards.splice(i, 1);
					}
				}
			} else {
				$scope.placard.$remove(function() {
					$location.path('placards');
				});
			}
		};

		// Update existing Placard
		$scope.update = function() {
			var placard = $scope.placard ;

			placard.$update(function() {
				$location.path('placards/' + placard._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Placards
		$scope.find = function() {
			$scope.placards = Placards.query();
		};

		// Find existing Placard
		$scope.findOne = function() {
			$scope.placard = Placards.get({ 
				placardId: $stateParams.placardId
			});
		};
	}
]);