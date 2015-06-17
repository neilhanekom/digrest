'use strict';

angular.module('tallies').controller('TalliesreportsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Tallies', 'moment', '$timeout', '$filter', 'filterFilter',
	function($scope, $stateParams, $location, Authentication, Tallies, moment, $timeout, $filter, filterFilter) {

		// first init
		
		
		//Scope Colors for anything
		$scope.standard = '#ECEFF1';
		$scope.dgrey = '#37474F';
		$scope.red = '#FF3D00';

		// Some repeat Data
		$scope.months = [{name: 'Jan', active: false,  m_value: '01'}, {name: 'Feb', active: false, m_value: '02'}, {name: 'Mar', active: false, m_value: '03'}, {name: 'Apr', active: false, m_value: '04'}, {name: 'May', active: false, m_value: '05'}, {name: 'Jun', active: false, m_value: '06'}, {name: 'Jul', active: false, m_value: '07'}, {name: 'Aug', active: false, m_value: '08'}, {name: 'Sep', active: false, m_value: '09'}, {name: 'Oct', active: false, m_value: '10'}, {name: 'Nov', active: false, m_value: '11'}, {name: 'Dec', active: false, m_value: '12'}];
		$scope.days = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
		$scope.years = ['2015', '2016', '2017', '2018'];
		
		$scope.currentYear = moment().format('YYYY');
		$scope.currentMonth = moment().format('MM');

		$scope.setCurrentMonthActive = function() {
			angular.forEach($scope.months, function(month){
				if ($scope.currentMonth === month.m_value) {
					month.active = true;
					$scope.toggleMonth($scope.tallies, $scope.currentYear, month.m_value, month.active);
				}
			});
		};

		$scope.selectedTallies = [];


		// $scope.collectYears = function(array) {
			
		// };


		$scope.collectMonths = function(array, year) {
			// $scope.janTallies = filterFilter(array, { created: year + '-' + '01' });
			// $scope.febTallies = filterFilter(array, { created: year + '-' + '02' });
			// $scope.marTallies = filterFilter(array, { created: year + '-' + '03' });
			// $scope.aprTallies = filterFilter(array, { created: year + '-' + '04' });
			// $scope.mayTallies = filterFilter(array, { created: year + '-' + '05' });
			// $scope.junTallies = filterFilter(array, { created: year + '-' + '06' });
			// $scope.julTallies = filterFilter(array, { created: year + '-' + '07' });
			// $scope.augTallies = filterFilter(array, { created: year + '-' + '08' });
			// $scope.sepTallies = filterFilter(array, { created: year + '-' + '09' });
			// $scope.octTallies = filterFilter(array, { created: year + '-' + '10' });
			// $scope.novTallies = filterFilter(array, { created: year + '-' + '11' });
			// $scope.decTallies = filterFilter(array, { created: year + '-' + '12' });

			$scope.currentMonthTallies = filterFilter(array, { created: $scope.currentYear + '-' + $scope.currentMonth });


		};

		$scope.collectDays = function(array, month) {
			// angular.forEach(array, function(item){

			// });

			console.log(array);
			console.log(month);
		};

		$scope.selectday = function() {

		};

		
	      $scope.toggleMonth = function (array, year, month, active) {
	      	var active = active;
	      	
	       	$scope.selectedMonths = filterFilter(array, { created: year + '-' + month });

			if (active === true) {
				// Then we need to add all of this items to the sampler
				angular.forEach($scope.selectedMonths, function(moTally) {
					$scope.selectedTallies.push(moTally);
				});
				console.log($scope.selectedTallies);
			} else {
				angular.forEach($scope.selectedMonths, function(moTally) {
					angular.forEach($scope.selectedTallies, function(selTally, i) {
						if (moTally._id === selTally._id) {
							$scope.selectedTallies.splice(i);
						} 
					});
				});
				
			}

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

		$timeout(function(){
			$scope.collectMonths($scope.tallies, $scope.currentYear);
			$scope.setCurrentMonthActive();
		}, 1000);

	}
]);