'use strict';

// Configuring the Employees module
angular.module('employees').run(['Menus',
	function(Menus) {
		// Add the Employees dropdown item
		Menus.addMenuItem('topbar', {
			title: 'Employees',
			state: 'employees',
			type: 'dropdown'
		});

		// Add the dropdown list item
		Menus.addSubMenuItem('topbar', 'employees', {
			title: 'List Employees',
			state: 'employees.list'
		});

		// Add the dropdown create item
		Menus.addSubMenuItem('topbar', 'employees', {
			title: 'Create Employee',
			state: 'employees.create'
		});
	}
]);