'use strict';

//Setting up route
angular.module('enumerations').config(['$stateProvider',
	function($stateProvider) {
		// Enumerations state routing
		$stateProvider.
		state('enumeration-modal', {
			url: '/enumeration-modal',
			templateUrl: 'modules/enumerations/views/enumeration-modal.client.view.html'
		}).
		state('enumerations', {
			abstract: true,
			url: '/enumerations',
			template: '<ui-view/>'
		}).
		state('enumerations.list', {
			url: '',
			templateUrl: 'modules/enumerations/views/list-enumerations.client.view.html'
		}).
		state('enumerations.create', {
			url: '/create',
			templateUrl: 'modules/enumerations/views/create-enumeration.client.view.html'
		}).
		state('enumerations.view', {
			url: '/:enumerationId',
			templateUrl: 'modules/enumerations/views/view-enumeration.client.view.html'
		}).
		state('enumerations.edit', {
			url: '/:enumerationId/edit',
			templateUrl: 'modules/enumerations/views/edit-enumeration.client.view.html'
		});
	}
]);