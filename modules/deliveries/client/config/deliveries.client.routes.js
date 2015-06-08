'use strict';

//Setting up route
angular.module('deliveries').config(['$stateProvider',
	function($stateProvider) {
		// Deliveries state routing
		$stateProvider.
		state('deliveries', {
			abstract: true,
			url: '/deliveries',
			template: '<ui-view/>'
		}).
		state('deliveries.list', {
			url: '',
			templateUrl: 'modules/deliveries/views/list-deliveries.client.view.html'
		}).
		state('deliveries.create', {
			url: '/create',
			templateUrl: 'modules/deliveries/views/create-delivery.client.view.html'
		}).
		state('deliveries.view', {
			url: '/:deliveryId',
			templateUrl: 'modules/deliveries/views/view-delivery.client.view.html'
		}).
		state('deliveries.edit', {
			url: '/:deliveryId/edit',
			templateUrl: 'modules/deliveries/views/edit-delivery.client.view.html'
		});
	}
]);