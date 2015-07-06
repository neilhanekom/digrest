'use strict';

angular.module('core').controller('LeftController', ['$scope', 'Menus', 'Authentication', '$timeout', '$mdSidenav', '$log',
	function($scope, Menus, Authentication, $timeout, $mdSidenav, $log) {

		$scope.sidenav = Menus.getMenu('sidenav');

		$scope.showProfile = false;

		
		// All Colors Specs for Icons
		$scope.white = '#FFFFFF';
		$scope.charcoal = "#212121";
		$scope.lgrey = "#EEEEEE";
		$scope.grey = "#BDBDBD";
		$scope.dgrey = "#424242";


		$scope.close = function () {
	      $mdSidenav('left').close()
	        .then(function () {
	          $log.debug("close LEFT is done");
	        });
	    };


	    $scope.activeTab = [];
 
		    //check if the tab is active
		    $scope.isOpenTab = function (index) {
		        //check if this tab is already in the activeTab array
		        if ($scope.activeTab[0] === index) {
		        	return true;
		        } else {
		        	return false;
		        }
		    }
		 
		    //function to 'open' a tab
		    $scope.openTab = function (index) {
		        //Check if tabs is already open if 
		        if ($scope.isOpenTab(index)) {
		            $scope.activeTab.splice(0, $scope.activeTab.length);
		        } else {
		            //if it's not, splice it!
		            $scope.activeTab.splice(0, $scope.activeTab.length, index);
		            
		        }
	    }

	
        
		$scope.authentication = Authentication;

		$scope.sidenav = Menus.getMenu('sidenav');

	}
]);