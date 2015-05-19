'use strict';

// Placards controller
angular.module('placards').controller('PlacardsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Placards',
	function($scope, $stateParams, $location, Authentication, Placards ) {
		$scope.authentication = Authentication;

		// Create new Placard
		$scope.create = function() {
			// Create new Placard object
			var placard = new Placards ({
				name: this.name
			});

			// Redirect after save
			placard.$save(function(response) {
				$location.path('placards/' + response._id);

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