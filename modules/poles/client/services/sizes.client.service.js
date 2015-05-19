'use strict';

angular.module('poles').factory('Sizes', [
	function() {
		// Sizes service logic
		// ...

		// Public API
		return {
			getSizes: function() {
			
				return [ 25, 32, 50, 75, 100, 120, 125, 140, 150, 160, 175, 180, 200 ];
			}
		};
	}
]);