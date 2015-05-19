'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication', 'Roles', '$timeout',
	function($scope, $http, $location, Authentication, Roles, $timeout) {
		$scope.authentication = Authentication;

		$scope.selectedRole = [];

		$scope.loadRoles = function() {
		    // Use timeout to simulate a 650ms request.
		    $scope.roles = [];
		    return $timeout(function() {
		      $scope.roles = Roles.getRoles();

		    }, 650);
		  };

		$scope.logRole = function() {
			
			$timeout(function() {
		    var selRolesLength = $scope.selectedRole.length;
			if (selRolesLength > 0) {
				$scope.selectedRole.splice(0, selRolesLength, $scope.role);
				
			} else {
				$scope.selectedRole.push($scope.role);
				
			}
			$scope.credentials.roles = $scope.selectedRole;
			console.log($scope.credentials);
		    }, 300);
			
		};


		// If user is signed in then redirect back home
		// if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post('/api/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				// $scope.authentication.user = response;
				$scope.response = response;
				// And redirect to the index page
				// $location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/api/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/dashboard');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);