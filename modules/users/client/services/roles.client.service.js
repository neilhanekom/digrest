'use strict';

angular.module('users').factory('Roles', [
	function() {
		// Roles service logic
		// ...

		// Public API
		return {
			getRoles: function() {
				return ['user', 'assistant_forester', 'forest_manager', 'chief_officer', 'super'];
			}
		};
	}
]);