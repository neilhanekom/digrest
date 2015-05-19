'use strict';

angular.module('poles').factory('Lengths', [
	function() {
		// Lengths service logic
		// ...

		// Public API
		return {
			getAllLengths: function() {
				return [ 1.2, 1.4, 1.5, 1.8, 2.0, 2.1, 2.4, 2.5, 2.7, 3.0, 3.6, 4.2, 4.5, 4.8, 5.4, 6.0, 6.6, 7.2 ];
			},

			getPoleLengths: function() {
				return [ 1.2, 1.4, 1.5, 1.8, 2.0, 2.1, 2.4, 2.5, 2.7, 3.0, 3.6, 4.2, 4.5, 4.8, 5.4, 6.0, 6.6, 7.2 ];
			},

			getLogLengths: function() {
				return [2.0, 2.5, 3.0];
			},

			getTransLengths: function() {
				return [7.0, 8.0, 9.0, 11.0];
			}
		};
	}
]);