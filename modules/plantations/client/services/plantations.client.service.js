'use strict';

//Plantations service used to communicate Plantations REST endpoints
angular.module('plantations').factory('Plantations', ['$resource',
	function($resource) {
		return $resource('api/plantations/:plantationId', { plantationId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);