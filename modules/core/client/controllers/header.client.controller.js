'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$state', 'Authentication', 'Menus', '$timeout', '$mdSidenav', '$mdUtil', '$log',
	function($scope, $state, Authentication, Menus, $timeout, $mdSidenav, $mdUtil, $log) {

		$scope.colProfile = true;

		$scope.toggleProfile = function() {
			$scope.colProfile = !$scope.colProfile;
		};

		$scope.closeProfile = function() {
			$scope.colProfile = false;
		};

		// Expose view variables
		$scope.$state = $state;
		$scope.authentication = Authentication;

		$scope.toggleLeft = buildToggler('left');
		$scope.toggleRight = buildToggler('right');
		    /**
		     * Build handler to open/close a SideNav; when animation finishes
		     * report completion in console
		     */
		    function buildToggler(navID) {
		      var debounceFn =  $mdUtil.debounce(function(){
		            $mdSidenav(navID)
		              .toggle()
		              .then(function () {
		                $log.debug("toggle " + navID + " is done");
		              });
		          },300);
		      return debounceFn;
    	}

		// Get the topbar menu
		$scope.menu = Menus.getMenu('topbar');

		// Toggle the menu items
		$scope.isCollapsed = false;
		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);
