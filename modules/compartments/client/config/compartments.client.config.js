'use strict';

// Configuring the Compartments module
angular.module('compartments').run(['Menus',
	function(Menus) {
		// Add the Compartments dropdown item
		Menus.addMenuItem('topbar', {
			title: 'Compartments',
			state: 'compartments',
			type: 'dropdown'
		});

		// Add the dropdown list item
		Menus.addSubMenuItem('topbar', 'compartments', {
			title: 'List Compartments',
			state: 'compartments.list'
		});

		// Add the dropdown create item
		Menus.addSubMenuItem('topbar', 'compartments', {
			title: 'Create Compartment',
			state: 'compartments.create'
		});
	}
]);