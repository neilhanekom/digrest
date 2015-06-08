'use strict';

// Configuring the Tallies module
angular.module('tallies').run(['Menus',
	function(Menus) {
		// Add the Tallies dropdown item
		Menus.addMenuItem('topbar', {
			title: 'Tallies',
			state: 'tallies',
			type: 'dropdown'
		});

		// Add the dropdown list item
		Menus.addSubMenuItem('topbar', 'tallies', {
			title: 'List Tallies',
			state: 'tallies.list'
		});

		// Add the dropdown create item
		Menus.addSubMenuItem('topbar', 'tallies', {
			title: 'Create Tally',
			state: 'tallies.create'
		});
	}
]);