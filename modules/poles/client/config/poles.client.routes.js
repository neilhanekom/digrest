'use strict';

//Setting up route
angular.module('poles').config(['$stateProvider',
	function($stateProvider) {
		// Poles state routing
		$stateProvider.
		state('poles', {
			abstract: true,
			url: '/poles',
			template: '<ui-view/>'
		}).
		state('poles.list', {
			url: '',
			templateUrl: 'modules/poles/views/list-poles.client.view.html'
		}).
		state('poles.create', {
			url: '/create',
			templateUrl: 'modules/poles/views/create-pole.client.view.html'
		}).
		state('poles.view', {
			url: '/:poleId',
			templateUrl: 'modules/poles/views/view-pole.client.view.html'
		}).
		state('poles.edit', {
			url: '/:poleId/edit',
			templateUrl: 'modules/poles/views/edit-pole.client.view.html'
		});
	}
]);