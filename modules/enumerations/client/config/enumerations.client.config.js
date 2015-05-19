'use strict';

// Configuring the Enumerations module
angular.module('enumerations').run(['Menus',
	function(Menus) {
		// Add the Enumerations dropdown item
		Menus.addMenuItem('topbar', {
			title: 'Enumerations',
			state: 'enumerations',
			type: 'dropdown'
		});

		// Add the dropdown list item
		Menus.addSubMenuItem('topbar', 'enumerations', {
			title: 'List Enumerations',
			state: 'enumerations.list'
		});

		// Add the dropdown create item
		Menus.addSubMenuItem('topbar', 'enumerations', {
			title: 'Create Enumeration',
			state: 'enumerations.create'
		});
	}
]);