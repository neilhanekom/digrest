'use strict';

//Compartments service used to communicate Compartments REST endpoints
angular.module('compartments').factory('Compartments', ['$resource',
	function($resource) {
		return $resource('api/compartments/:compartmentId', { compartmentId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);