'use strict';

// Configuring the Deliveries module
angular.module('deliveries').run(['Menus',
	function(Menus) {
		// Add the Deliveries dropdown item
		Menus.addMenuItem('topbar', {
			title: 'Deliveries',
			state: 'deliveries',
			type: 'dropdown'
		});

		// Add the dropdown list item
		Menus.addSubMenuItem('topbar', 'deliveries', {
			title: 'List Deliveries',
			state: 'deliveries.list'
		});

		// Add the dropdown create item
		Menus.addSubMenuItem('topbar', 'deliveries', {
			title: 'Create Delivery',
			state: 'deliveries.create'
		});
	}
]);