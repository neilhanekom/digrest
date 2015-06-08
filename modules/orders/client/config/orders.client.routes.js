'use strict';

//Setting up route
angular.module('orders').config(['$stateProvider',
	function($stateProvider) {
		// Orders state routing
		$stateProvider.
		state('orders', {
			abstract: true,
			url: '/orders',
			template: '<ui-view/>'
		}).
		state('orders.list', {
			url: '',
			templateUrl: 'modules/orders/views/list-orders.client.view.html'
		}).
		state('orders.create', {
			url: '/create',
			templateUrl: 'modules/orders/views/create-order.client.view.html'
		}).
		state('orders.view', {
			url: '/:orderId',
			templateUrl: 'modules/orders/views/view-order.client.view.html'
		}).
		state('orders.edit', {
			url: '/:orderId/edit',
			templateUrl: 'modules/orders/views/edit-order.client.view.html'
		});
	}
]);