'use strict';

// Configuring the Poles module
angular.module('poles').run(['Menus',
	function(Menus) {
		// Add the Poles dropdown item
		Menus.addMenuItem('topbar', {
			title: 'Poles',
			state: 'poles',
			type: 'dropdown'
		});

		// Add the dropdown list item
		Menus.addSubMenuItem('topbar', 'poles', {
			title: 'List Poles',
			state: 'poles.list'
		});

		// Add the dropdown create item
		Menus.addSubMenuItem('topbar', 'poles', {
			title: 'Create Pole',
			state: 'poles.create'
		});
	}
]);