'use strict';

// Configuring the Orders module
angular.module('orders').run(['Menus',
	function(Menus) {
		// Add the Orders dropdown item
		Menus.addMenuItem('topbar', {
			title: 'Orders',
			state: 'orders',
			type: 'dropdown'
		});

		// Add the dropdown list item
		Menus.addSubMenuItem('topbar', 'orders', {
			title: 'List Orders',
			state: 'orders.list'
		});

		// Add the dropdown create item
		Menus.addSubMenuItem('topbar', 'orders', {
			title: 'Create Order',
			state: 'orders.create'
		});
	}
]);