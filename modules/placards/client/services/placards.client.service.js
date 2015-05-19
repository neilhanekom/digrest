'use strict';

//Placards service used to communicate Placards REST endpoints
angular.module('placards').factory('Placards', ['$resource',
	function($resource) {
		return $resource('api/placards/:placardId', { placardId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);