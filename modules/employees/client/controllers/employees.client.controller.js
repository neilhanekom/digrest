'use strict';

// Employees controller
angular.module('employees').controller('EmployeesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Employees', 'EmployeeRoles', '$timeout',
	function($scope, $stateParams, $location, Authentication, Employees, EmployeeRoles, $timeout ) {
		$scope.authentication = Authentication;


		// color for icons
		$scope.white = '#FFFFFF';

		$scope.loadRoles = function() {
		    // Use timeout to simulate a 650ms request.
		    $scope.roles = [];
		    return $timeout(function() {
		      $scope.roles = EmployeeRoles.getRoles();

		    }, 650);
		  };

		// Create new Employee
		$scope.create = function() {
			// Create new Employee object
			var employee = new Employees ({
				firstName: $scope.credentials.firstName,
				lastName: $scope.credentials.lastName,
				rsaId: $scope.credentials.rsaId,
				title: $scope.credentials.title,
				gender: $scope.credentials.gender,
				mobile: $scope.credentials.mobile,
				email: $scope.credentials.email,
				role: $scope.role

			});

			// Redirect after save
			employee.$save(function(response) {
				// $location.path('employees/' + response._id);
				$scope.response = response;
				// Clear form fields
				// $scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Employee
		$scope.remove = function( employee ) {
			if ( employee ) { employee.$remove();

				for (var i in $scope.employees ) {
					if ($scope.employees [i] === employee ) {
						$scope.employees.splice(i, 1);
					}
				}
			} else {
				$scope.employee.$remove(function() {
					$location.path('employees');
				});
			}
		};

		// Update existing Employee
		$scope.update = function() {
			var employee = $scope.employee ;

			employee.$update(function() {
				$location.path('employees/' + employee._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Employees
		$scope.find = function() {
			$scope.employees = Employees.query();
		};

		// Find existing Employee
		$scope.findOne = function() {
			$scope.employee = Employees.get({ 
				employeeId: $stateParams.employeeId
			});
		};
	}
]);