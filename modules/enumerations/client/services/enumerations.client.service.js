'use strict';

//Enumerations service used to communicate Enumerations REST endpoints
angular.module('enumerations').factory('Enumerations', ['$resource',
	function($resource) {
		return $resource('api/enumerations/:enumerationId', { enumerationId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);