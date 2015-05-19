'use strict';

// Configuring the Plantations module
angular.module('plantations').run(['Menus',
	function(Menus) {
		// Add the Plantations dropdown item
		Menus.addMenuItem('topbar', {
			title: 'Plantations',
			state: 'plantations',
			type: 'dropdown'
		});

		// Add the dropdown list item
		Menus.addSubMenuItem('topbar', 'plantations', {
			title: 'List Plantations',
			state: 'plantations.list'
		});

		// Add the dropdown create item
		Menus.addSubMenuItem('topbar', 'plantations', {
			title: 'Create Plantation',
			state: 'plantations.create'
		});
	}
]);