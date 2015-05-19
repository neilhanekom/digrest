'use strict';

//Poles service used to communicate Poles REST endpoints
angular.module('poles').factory('Poles', ['$resource',
	function($resource) {
		return $resource('api/poles/:poleId', { poleId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);