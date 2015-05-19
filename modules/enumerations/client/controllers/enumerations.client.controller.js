'use strict';

// Enumerations controller
angular.module('enumerations').controller('EnumerationsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Enumerations',
	function($scope, $stateParams, $location, Authentication, Enumerations ) {
		$scope.authentication = Authentication;

		// color for icons
		$scope.white = '#FFFFFF';

		// Create new Enumeration
		$scope.create = function() {
			// Create new Enumeration object
			var enumeration = new Enumerations ({
				name: this.name
			});

			// Redirect after save
			enumeration.$save(function(response) {
				$location.path('enumerations/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Enumeration
		$scope.remove = function( enumeration ) {
			if ( enumeration ) { enumeration.$remove();

				for (var i in $scope.enumerations ) {
					if ($scope.enumerations [i] === enumeration ) {
						$scope.enumerations.splice(i, 1);
					}
				}
			} else {
				$scope.enumeration.$remove(function() {
					$location.path('enumerations');
				});
			}
		};

		// Update existing Enumeration
		$scope.update = function() {
			var enumeration = $scope.enumeration ;

			enumeration.$update(function() {
				$location.path('enumerations/' + enumeration._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Enumerations
		$scope.find = function() {
			$scope.enumerations = Enumerations.query();
		};

		// Find existing Enumeration
		$scope.findOne = function() {
			$scope.enumeration = Enumerations.get({ 
				enumerationId: $stateParams.enumerationId
			});
		};
	}
]);