'use strict';

//Setting up route
angular.module('placards').config(['$stateProvider',
	function($stateProvider) {
		// Placards state routing
		$stateProvider.
		state('placards', {
			abstract: true,
			url: '/placards',
			template: '<ui-view/>'
		}).
		state('placards.list', {
			url: '',
			templateUrl: 'modules/placards/views/list-placards.client.view.html'
		}).
		state('placards.create', {
			url: '/create',
			templateUrl: 'modules/placards/views/create-placard.client.view.html'
		}).
		state('placards.view', {
			url: '/:placardId',
			templateUrl: 'modules/placards/views/view-placard.client.view.html'
		}).
		state('placards.edit', {
			url: '/:placardId/edit',
			templateUrl: 'modules/placards/views/edit-placard.client.view.html'
		});
	}
]);