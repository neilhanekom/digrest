'use strict';

// Poles controller
angular.module('poles').controller('PolesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Poles', 'Sizes', 'Lengths', '$timeout', '$mdDialog', '$filter',
	function($scope, $stateParams, $location, Authentication, Poles, Sizes, Lengths, $timeout, $mdDialog, $filter ) {
		$scope.authentication = Authentication;

		// initizialize value
		$scope.newLength = 0;
		$scope.minWidth = 0;
		$scope.maxWidth = 0;
		$scope.unit = 'mm';
		$scope.showCenti = false;
		$scope.showMilli = true;
		


		$scope.white = '#FFFFFF';
		$scope.red = '#F44336';
		$scope.blue = '#2196F3';

		$scope.lengthSelector = false;

		$scope.allLengths = Lengths.getAllLengths();
		$scope.poleLengths = Lengths.getPoleLengths();
		$scope.logLengths = Lengths.getLogLengths();
		$scope.transLenghts = Lengths.getTransLengths();

		$scope.selLengths = [];

		$scope.selSizes = [];

		$scope.selProduct = [];

		$scope.selectProduct = function(product) {
			var length = $scope.selProduct.length;
			if (length > 0 ) {
				$scope.selProduct.splice(0, length, product);
			} else {
				$scope.selProduct.push(product);
			}
			
		};

		$scope.products = [
					{ name: 'Lath', sizes: [ { min: '25', max: '32'} ], lengths: $scope.allLengths },
					{ name: 'Dropper', sizes: [ { min: '32', max: '50'} ], lengths: $scope.allLengths},
					{ name: 'B&F', sizes: [], lengths: $scope.allLengths},
					{ name: 'Transmision', sizes: [], lengths: $scope.transLenghts},
					{ name: 'Sawlog', sizes: [], lengths: $scope.logLengths}		
		];

		
		$scope.showAddS = function() {
			$scope.showAddSize = true;
		};

		$scope.hideAddS = function() {
			$scope.showAddSize = false;
		};

		$scope.generateLengths = function(product) {
			var lengthLen = $scope.selLengths.length;
			
			if (product === 'Laths' || product === 'Droppers' || product === 'B&F' ) {
				 $scope.selLengths.splice(0, lengthLen);
				angular.forEach($scope.poleLengths, function(value) {
					$scope.selLengths.push(value);
				});
			} else  {
				$scope.selLengths.splice(0, lengthLen);
				
				angular.forEach($scope.logLengths, function(value) {
					$scope.selLengths.push(value);
				});
			} 
		};

	
		$scope.displayOptions = false;

		$scope.openOptions = function(index) {
			$scope.displayOptions = true;
		};

		$scope.closeOptions = function() {
			$scope.displayOptions = false;
		};

		$scope.getLengths = function() {
			return $timeout(function() {
				$scope.lengths = Lengths.getLengths();
			}, 650);
		};

		$scope.getSizes = function() {
			return $timeout(function() {
				$scope.sizes = Sizes.getSizes();
			}, 650);
		};

		$scope.addLength = function() {
			$scope.selLengths.push($scope.newLength);
		};

		$scope.removeLength = function(index) {
			$scope.selLengths.splice(index, 1);
		};

		$scope.addNewSize = function() {
			
			var filtMin = $filter('number')($scope.minWidth, 1);
			var filtMax = $filter('number')($scope.maxWidth, 1);
			var parsedMin = parseFloat(filtMin);
			var parsedMax = parseFloat(filtMax);
			var newSize = { min: parsedMin , max: parsedMax};
			var length = $scope.product.sizes.length;
			$scope.product.sizes.push(newSize);

		};

		$scope.addWidths = function() {

		};

		$scope.addNewLength = function() {
			var newLength = $scope.newLength;
			var filtLength = $filter('number')(newLength, 1);
			filtLength =  parseFloat(filtLength);
			$scope.lengthSelector = false;
			$scope.product.lengths.push(filtLength);
		};

		$scope.cancelLength = function(){
			$scope.lengthSelector = false;
		};

		$scope.showLengthSelector = function() {
			$scope.lengthSelector = true;
		};

		$scope.openMilli = function() {
			$scope.showMilli = true;
			$scope.showCenti = false;
			$scope.minWidth = 0;
			$scope.maxWidth = 0;
			$scope.unit = 'mm';

		};

		$scope.openCenti = function() {
			$scope.showMilli = false;
			$scope.showCenti = true;
			$scope.minWidth = 0;
			$scope.maxWidth = 0;
			$scope.unit = 'cm';
		};

	

		// Create new Pole
		$scope.create = function() {
			// Create new Pole object
			var pole = new Poles ({
				product: $scope.product.name,
				sizes: $scope.product.sizes,
				lengths: $scope.product.lengths,
				unit: $scope.unit

			});


			// Redirect after save
			pole.$save(function(response) {
				$location.path('poles/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Pole
		$scope.remove = function( pole ) {
			if ( pole ) { pole.$remove();

				for (var i in $scope.poles ) {
					if ($scope.poles [i] === pole ) {
						$scope.poles.splice(i, 1);
					}
				}
			} else {
				$scope.pole.$remove(function() {
					$location.path('poles');
				});
			}
		};

		// Update existing Pole
		$scope.update = function() {
			var pole = $scope.pole ;

			pole.$update(function() {
				$location.path('poles/' + pole._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Poles
		$scope.find = function() {
			$scope.poles = Poles.query();
		};

		// Find existing Pole
		$scope.findOne = function() {
			$scope.pole = Poles.get({ 
				poleId: $stateParams.poleId
			});
		};
	}
]);