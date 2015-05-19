'use strict';

//Setting up route
angular.module('compartments').config(['$stateProvider',
	function($stateProvider) {
		// Compartments state routing
		$stateProvider.
		state('compartments', {
			abstract: true,
			url: '/compartments',
			template: '<ui-view/>'
		}).
		state('compartments.list', {
			url: '',
			templateUrl: 'modules/compartments/views/list-compartments.client.view.html'
		}).
		state('compartments.create', {
			url: '/create',
			templateUrl: 'modules/compartments/views/create-compartment.client.view.html'
		}).
		state('compartments.view', {
			url: '/:compartmentId',
			templateUrl: 'modules/compartments/views/view-compartment.client.view.html'
		}).
		state('compartments.edit', {
			url: '/:compartmentId/edit',
			templateUrl: 'modules/compartments/views/edit-compartment.client.view.html'
		});
	}
]);