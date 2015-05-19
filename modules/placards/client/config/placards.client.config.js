'use strict';

// Configuring the Placards module
angular.module('placards').run(['Menus',
	function(Menus) {
		// Add the Placards dropdown item
		Menus.addMenuItem('topbar', {
			title: 'Placards',
			state: 'placards',
			type: 'dropdown'
		});

		// Add the dropdown list item
		Menus.addSubMenuItem('topbar', 'placards', {
			title: 'List Placards',
			state: 'placards.list'
		});

		// Add the dropdown create item
		Menus.addSubMenuItem('topbar', 'placards', {
			title: 'Create Placard',
			state: 'placards.create'
		});
	}
]);