'use strict';

//Setting up route
angular.module('plantations').config(['$stateProvider',
	function($stateProvider) {
		// Plantations state routing
		$stateProvider.
		state('plantations', {
			abstract: true,
			url: '/plantations',
			template: '<ui-view/>'
		}).
		state('plantations.list', {
			url: '',
			templateUrl: 'modules/plantations/views/list-plantations.client.view.html'
		}).
		state('plantations.create', {
			url: '/create',
			templateUrl: 'modules/plantations/views/create-plantation.client.view.html'
		}).
		state('plantations.view', {
			url: '/:plantationId',
			templateUrl: 'modules/plantations/views/view-plantation.client.view.html'
		}).
		state('plantations.edit', {
			url: '/:plantationId/edit',
			templateUrl: 'modules/plantations/views/edit-plantation.client.view.html'
		});
	}
]);