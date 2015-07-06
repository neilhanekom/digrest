'use strict';

// Enumerations controller
angular.module('enumerations').controller('EnumerationsController', ['$scope', '$stateParams', '$location', '$filter', '$timeout', 'Authentication', 'Enumerations', 'Suppliers', 'Plantations', 'Compartments', 'Placards', '$modal', '$log', 'Volume',
	function($scope, $stateParams, $location, $filter, $timeout, Authentication, Enumerations, Suppliers, Plantations, Compartments, Placards, $modal, $log, Volume ) {
		$scope.authentication = Authentication;

		$scope.filterEnums = function(filtercriteria){
			var Enums = Enumerations.query();
			$timeout(function(){
				$scope.enumerations = $filter('filter')(Enums, filtercriteria);
			}, 500 );
			
		};

		$scope.getSupplier = function(supplier) {
			$scope.supplier = supplier;
			$scope.supplier = Suppliers.get({ 
				supplierId: supplier._id
			});
			
			$timeout(function(){
				$scope.plantations = $scope.supplier.plantations;
				var crit = {
					supplier: {name: $scope.supplier.name}
				};
				$scope.filterEnums(crit);
			}, 300);
			

		};

		// color for icons
		$scope.white = '#FFFFFF';

		$scope.suppliers = Suppliers.query();

		$scope.getPlantation = function(id) {
			$scope.plantation = Plantations.get({ 
				plantationId: id
			});

			$timeout(function(){
				var crit = {
					plantation: {name: $scope.plantation.name}
				};
				$scope.filterEnums(crit);
			}, 80);
			
		};

		$scope.getCompartment = function (id) {
			$scope.compartment = Compartments.get({ 
				compartmentId: id
			});

			$timeout(function(){
				var crit = {
					compartment: $scope.compartment.name
				};

				$scope.filterEnums(crit);
			}, 80);

			

		};

		// $scope.getEnums = function(filterBy, ) {
			
		// };

		// Create new Enumeration
		$scope.create = function() {
			// Create new Enumeration object
			var enumeration = new Enumerations ({
				name: this.name
			});

			// Redirect after save
			enumeration.$save(function(response) {
				$location.path('enumerations/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Enumeration
		$scope.remove = function( enumeration ) {
			if ( enumeration ) { enumeration.$remove();

				for (var i in $scope.enumerations ) {
					if ($scope.enumerations [i] === enumeration ) {
						$scope.enumerations.splice(i, 1);
					}
				}
			} else {
				$scope.enumeration.$remove(function() {
					$location.path('enumerations');
				});
			}
		};

		// Update existing Enumeration
		$scope.update = function() {
			var enumeration = $scope.enumeration ;

			enumeration.$update(function() {
				$location.path('enumerations/' + enumeration._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Enumerations
		$scope.find = function() {
			$scope.enumerations = Enumerations.query();
			console.log($scope.enumerations);
			// $scope.enumerations = $filter('filter')($scope.enumerations, { compartment: "TG12" });
			
			
			
		};

		// Find existing Enumeration
		$scope.findEnum = function(enumeration) {
			$scope.enumeration = Enumerations.get({ 
				enumerationId: enumeration._id
			});


		};


		  this.openEnumerationReport = function (enumeration, enumerations) {

		    var modalInstance = $modal.open({
		      animation: $scope.animationsEnabled,
		      templateUrl: 'modules/enumerations/views/enumeration-modal.client.view.html',
		      controller: function ($scope, $modalInstance, enumeration, enumerations, Volume) {

		      		$scope.colorsRep = ['#149588', '#ff6666', '#f1b44b', '#26C6DA', '#D4E157'];

		      		$scope.enumeration = enumeration;
		      		$scope.enumerations = enumerations;
		      		generateProducts();
		      		$scope.volumeCalc = Volume.getVolume;
				  	
				  	function generateProducts() {
				  		var enumproducts = [];

				  		function checkIfExist(a, p) {
							var result = false;
							var alength = a.length;
							for (var j = 0; j < alength; j++ ) {
								var testProduct = a[j];
								if (p === testProduct) {
									result = true;
								}
							}

							return result; 	
						};

				  		angular.forEach($scope.enumerations, function(enumeration){
				  			angular.forEach(enumeration.trees, function(tree){

				  				angular.forEach(tree.sections, function(section){
				  					var l = enumproducts.length;
				  					if (l === 0) {
				  						enumproducts.push(section.product);
				  					} else if ( l > 0 ) {
				  						var result = checkIfExist(enumproducts, section.product);
				  						if (result === false) {
											enumproducts.push(section.product);
										} 
				  					}
				  				});
				  			});
				  		});
				  		$scope.enumproducts = enumproducts;
				  		console.log($scope.enumproducts);
				  	};

				  	$scope.getTotalVol = function(array) {
				  		var vol = 0;
				  		function calcVol(taper, min, max, length) {
				  			
			  					var pie = 3.14159;
						      	var diaMid = (min + max)/2;
						      	var vol = (((Math.pow(diaMid + (0.5 * taper * length), 2))*length)*pie)/40000;
				  			
				  			return vol;	
				  		};
				  		
				  		angular.forEach(array, function(item){
				  			angular.forEach(item.sections, function(section){
				  					var newVol = $scope.volumeCalc(section.product, section.min, section.max, section.length);
				  					vol += newVol;
				  			});		
				  		});		
				  			
				  		

				  		return vol;
				  	};

				  	$scope.getTotal = function(array) {
				  		var total = 0;
				  		
				  		angular.forEach(array, function(item){
				  			angular.forEach(item.sections, function(section){
				  				total += 1;
				  			});
				  		});

				  		return total;
				  	};

				  	$scope.getProductVol = function(array, product) {
				  		var vol = 0;
				  		


				  		angular.forEach(array, function(item){
				  			angular.forEach(item.sections, function(section){
				  				if (section.product === product) {
				  					var newVol = $scope.volumeCalc(section.product, section.min, section.max, section.length);
				  					vol += newVol;
				  					
				  				}; 
				  			});
				  		});


				  		return vol;
				  	};

				  	$scope.getProductTotal = function(array, product) {
				  		var total = 0;
				  		
				  		angular.forEach(array, function(item){
				  			angular.forEach(item.sections, function(section){
				  				if (section.product === product) {
				  					
				  					total += 1;
				  				}; 
				  			});
				  		});

				  		return total;
				  	};

				  	$scope.getEnumSizes = function(array, product) {
				  		var productSizes = [];

				  		function checkIfExist(a, p) {
							var result = false;
							var alength = a.length;
							for (var j = 0; j < alength; j++ ) {
								var testProduct = a[j];
								if (p === testProduct) {
									result = true;
								}
							}

							return result; 	
						};

						

				  		angular.forEach(array, function(tree) {

				  			var newArray = $filter('filter')(tree.sections, {product: product});


				  			angular.forEach(newArray, function(item){
				  					var l = productSizes.length;
				  						if ( l === 0) {
						  					productSizes.push(item.min);
						  				} else if ( l > 0 ) {
						  					var result = checkIfExist(productSizes, item.min);
						  					if (result === false) {
						  						productSizes.push(item.min);
						  					}
						  				}
						  			});
				  			

				  			
				  		});

				  		return productSizes;
				  	};

				  	$scope.getSizeVolume = function(array, product, size) {
				  		var vol = 0;

				  		function checkIfExist(a, p) {
							var result = false;
							var alength = a.length;
							for (var j = 0; j < alength; j++ ) {
								var testProduct = a[j];
								if (p === testProduct) {
									result = true;
								}
							}

							return result; 	
						};

						

				  		angular.forEach(array, function(tree) {

				  			var newArray = $filter('filter')(tree.sections, {product: product});
				  			
				  			angular.forEach(newArray, function(item){
				  				if (item.min === size) {
				  					var newVol = $scope.volumeCalc(product, item.min, item.max, item.length);
				  					vol += newVol;
				  				}		
						  	});
				  			

				  			
				  		});

				  		return vol;
				  	};

				  	$scope.getSizeTotal = function(array, product, size) {
				  		var total = 0;

				  		function checkIfExist(a, p) {
							var result = false;
							var alength = a.length;
							for (var j = 0; j < alength; j++ ) {
								var testProduct = a[j];
								if (p === testProduct) {
									result = true;
								}
							}

							return result; 	
						};

						

				  		angular.forEach(array, function(tree) {

				  			var newArray = $filter('filter')(tree.sections, {product: product});
				  			
				  			angular.forEach(newArray, function(item){
				  				if (item.min === size) {
				  					total += 1;
				  				}		
						  	});
				  			

				  			
				  		});

				  		return total;
				  	};

				  

				  $scope.ok = function () {
				    $modalInstance.close($scope.selected.item);
				  };

				  $scope.cancel = function () {
				    $modalInstance.dismiss('cancel');
				  };
				},
		      size: 'lg',
		      resolve: {
		        enumeration: function () {
		          return $scope.enumeration;
		        },
		        enumerations: function () {
		        	return $scope.enumerations;
		        }
		      }
		    });

		    modalInstance.result.then(function (selectedItem) {
		      $scope.selected = selectedItem;
		    }, function () {
		      $log.info('Modal dismissed at: ' + new Date());
		    });
		  };


	}
]);