'use strict';

angular.module('employees').factory('EmployeeRoles', [
	function() {
		// Employee roles service logic
		// ...

		// Public API
		return {
			getRoles: function() {
				return ['Pusher', 'Feller', 'Debarker', 'Logroller', 'Felling_Supervisor', 'Driver', 'Operator'];
			}
		};
	}
]);