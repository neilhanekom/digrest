'use strict';

//Tallies service used to communicate Tallies REST endpoints
angular.module('tallies').factory('Tallies', ['$resource',
	function($resource) {
		return $resource('api/tallies/:tallyId', { tallyId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);