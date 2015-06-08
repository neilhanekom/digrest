'use strict';

// Tallies controller
angular.module('tallies').controller('TalliesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Tallies',
	function($scope, $stateParams, $location, Authentication, Tallies ) {
		$scope.authentication = Authentication;

		// Create new Tally
		$scope.create = function() {
			// Create new Tally object
			var tally = new Tallies ({
				name: this.name
			});

			// Redirect after save
			tally.$save(function(response) {
				$location.path('tallies/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Tally
		$scope.remove = function( tally ) {
			if ( tally ) { tally.$remove();

				for (var i in $scope.tallies ) {
					if ($scope.tallies [i] === tally ) {
						$scope.tallies.splice(i, 1);
					}
				}
			} else {
				$scope.tally.$remove(function() {
					$location.path('tallies');
				});
			}
		};

		// Update existing Tally
		$scope.update = function() {
			var tally = $scope.tally ;

			tally.$update(function() {
				$location.path('tallies/' + tally._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Tallies
		$scope.find = function() {
			$scope.tallies = Tallies.query();
		};

		// Find existing Tally
		$scope.findOne = function() {
			$scope.tally = Tallies.get({ 
				tallyId: $stateParams.tallyId
			});
		};
	}
]);