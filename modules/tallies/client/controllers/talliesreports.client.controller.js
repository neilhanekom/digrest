'use strict';

angular.module('tallies').controller('TalliesreportsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Tallies', 'moment', '$timeout', '$filter', 'filterFilter',
	function($scope, $stateParams, $location, Authentication, Tallies, moment, $timeout, $filter, filterFilter) {

		// first init
		
		
		//Scope Colors for anything
		$scope.standard = '#ECEFF1';
		$scope.dgrey = '#37474F';
		$scope.red = '#FF3D00';

		// Some repeat Data
		$scope.months = [{name: 'Jan', m_value: 0, tallies: $scope.janTallies}, {name: 'Feb', m_value: 1}, {name: 'Mar', m_value: 2}, {name: 'Apr', m_value: 3}, {name: 'May', m_value: 4}, {name: 'Jun', m_value: 5}, {name: 'Jul', m_value: 6}, {name: 'Aug', m_value: 7}, {name: 'Sep', m_value: 8}, {name: 'Oct', m_value: 9}, {name: 'Nov', m_value: 10}, {name: 'Dec', m_value: 11}];
		$scope.days = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
		$scope.years = ['2015'];
		

		$scope.talliesMonthly = [];



		// $scope.collectMonths = function(array) {
		// 	$scope.janTallies = $filter('date')($scope.tallies, { created:  })
		// };



		
	      $scope.toggleMonth = function (item, list) {
	       angular.forEach(list, function(listItem){
	       	// if (listItem.active === true) {
	       	// 	listItem.active = false;
	       	// }
	       	item.active = !item.active;
	       });
	
	      };
	      $scope.existsMonth = function (item, list) {
	        return list.indexOf(item) > -1;
	      };

	     $scope.selDays = [];
	     $scope.toggleDay = function (item, list) {
	        var idx = list.indexOf(item);
	        if (idx > -1) list.splice(idx, 1);
	        else list.push(item);
	      };
	      $scope.existsDay = function (item, list) {
	        return list.indexOf(item) > -1;
	      };

		$scope.find = function() {
			$scope.tallies = Tallies.query();

		};

		// $timeout(function(){
		// 	$scope.collectMonths($scope.tallies);
		// }, 1000);

	}
]);