'use strict';

//Setting up route
angular.module('tallies').config(['$stateProvider',
	function($stateProvider) {
		// Tallies state routing
		$stateProvider.
		state('monthly-report-production', {
			url: '/monthly-report-production',
			templateUrl: 'modules/tallies/views/monthly_report_production.client.view.html'
		}).
		state('tallyreport', {
			url: '/tallyreport',
			templateUrl: 'modules/tallies/views/tallyreport.client.view.html'
		}).
		state('tallies', {
			abstract: true,
			url: '/tallies',
			template: '<ui-view/>'
		}).
		state('tallies.list', {
			url: '',
			templateUrl: 'modules/tallies/views/list-tallies.client.view.html'
		}).
		state('tallies.reports', {
			url: '/reports',
			templateUrl: 'modules/tallies/views/reports-tally.client.view.html'
		}).
		state('tallies.create', {
			url: '/create',
			templateUrl: 'modules/tallies/views/create-tally.client.view.html'
		}).
		state('tallies.view', {
			url: '/:tallyId',
			templateUrl: 'modules/tallies/views/view-tally.client.view.html'
		}).
		state('tallies.edit', {
			url: '/:tallyId/edit',
			templateUrl: 'modules/tallies/views/edit-tally.client.view.html'
		});
	}
]);