'use strict';

angular.module('tallies').controller('TalliesreportsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Tallies', 'moment', '$timeout', '$filter', 'filterFilter', 'Volume', '$mdToast', '$animate', '$mdDialog', '$modal', '$log',
	function($scope, $stateParams, $location, Authentication, Tallies, moment, $timeout, $filter, filterFilter, Volume, $mdToast, $animate, $mdDialog, $modal, $log) {

		this.openDailyProductionReport = function(size, tallies, year, month, day ) {
				


				var modalInstance = $modal.open({
		      animation: true,
		      templateUrl: 'modules/tallies/views/monthly-report-production.client.view.html',
		      controller: function ($scope, $modalInstance, tallies, Volume) {

		      	$scope.volumeCube = Volume.cubicMeter;

		      	$scope.colorsRep = ['#149588', '#ff6666', '#f1b44b', '#26C6DA', '#D4E157'];

		      	$scope.tallies = tallies;

		      	function getDayProducts (array) {
					var productsInTime = [];

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

					angular.forEach(array, function(tally) {
						angular.forEach(tally.stock, function(stockItem){
							var productsLength = productsInTime.length;
							if (stockItem.product_name === 'B&F') {
								var newproduct = stockItem.product_name +  '_' + stockItem.sabs;
								if ( productsLength === 0 ) {
									productsInTime.push(newproduct);
								} else if (productsLength > 0) {
									var result = checkIfExist(productsInTime, newproduct);
									if (result === false) {
										productsInTime.push(newproduct);
									} 
								}
							} else {
								var newproduct = stockItem.product_name;
								if ( productsLength === 0 ) {
									productsInTime.push(newproduct);
								} else if (productsLength > 0) {
									var result = checkIfExist(productsInTime, newproduct);
									if (result === false) {
										productsInTime.push(newproduct);
									} 
								}
							}
							


							
						});
					});

					return productsInTime;
				};

		      	function generateDayTallies (array, year, month, day) {
		      		console.log(year + month + day);
					var dailyTallies = $filter('filter')(array, { created: year + '-' + month + '-' + day});
					return dailyTallies;
				};

				$scope.reportDailyTallies = generateDayTallies(tallies, year, month, day);
				$scope.dayProducts = getDayProducts($scope.reportDailyTallies);


				$scope.getSuppliers = function (tallies) {

					
					var suppliers = [];

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

					angular.forEach(tallies, function(tally){
						var suppliersLength = suppliers.length;

						if (suppliersLength === 0) {
							suppliers.push(tally.supplier);
						} else if (suppliersLength > 0 ) {
							var result = checkIfExist(suppliers, tally.supplier);
							if (result === false ) {
								suppliers.push(tally.supplier);
							}
						}
					});

					return suppliers;

				};

				$scope.filterDay_Supplier = function(array, supplier) {
					array = generateDayTallies(tallies, year, month, day);
					
					$timeout(function(){
						var filteredArray = $filter('filter')(array, { supplier: supplier});
						$scope.reportDailyTallies = filteredArray;
					}, 50);
					
				};

				$scope.checkProductExist = function(array, product) {
					var exist = false;
					angular.forEach(array, function(tally) {				
						if (tally.stock) {
							if (product === 'B&F_457') {
								var spec = /[0-9]+/g.exec(product);
								var specProduct = /[\w]&[\w]/g.exec(product);
		
								var filteredProducts = $filter('filter')(tally.stock, { product_name: specProduct[0]});
								var filteredSpecs = $filter('filter')(filteredProducts, { sabs: spec[0]});
								var length = filteredSpecs.length;
								if (length > 0) {
									exist = true;
								}
								
							} else if (product === 'B&F_1288') {
								var spec = /[0-9]+/g.exec(product);
								var specProduct = /[\w]&[\w]/g.exec(product);
								
								var filteredProducts = $filter('filter')(tally.stock, { product_name: specProduct[0]});
								var filteredSpecs = $filter('filter')(filteredProducts, { sabs: spec[0]});
								var length = filteredSpecs.length;
								if (length > 0) {
									exist = true;
								}
								
							} else if (product === 'SAW') {
								var filteredProducts = $filter('filter')(tally.stock, { product_name: product});
								var length = filteredProducts.length;
								if (length > 0) {
									exist = true;
								}
							} else {
								var filteredProducts = $filter('filter')(tally.stock, { product_name: product});
								var length = filteredProducts.length;
								if (length > 0) {
									exist = true;
								}
							}

								
						} else {
							return;
						}
					});
					
					return exist;
				};

				
				$scope.getProductVolDay = function(array, product) {
				var vol = 0;

				angular.forEach(array, function(tally) {				
						if (tally.stock) {
							if (product === 'B&F_457') {
								var spec = /[0-9]+/g.exec(product);
								var specProduct = /[\w]&[\w]/g.exec(product);
		
								var filteredProducts = $filter('filter')(tally.stock, { product_name: specProduct[0]});
								var filteredSpecs = $filter('filter')(filteredProducts, { sabs: spec[0]});
								angular.forEach(filteredSpecs, function(spec) {
									var newVol = $scope.volumeCube(0.7, spec.min, spec.max, spec.length, 'mm');
									vol += newVol;
								});
								
							} else if (product === 'B&F_1288') {
								var spec = /[0-9]+/g.exec(product);
								var specProduct = /[\w]&[\w]/g.exec(product);
								
								var filteredProducts = $filter('filter')(tally.stock, { product_name: specProduct[0]});
								var filteredSpecs = $filter('filter')(filteredProducts, { sabs: spec[0]});
								angular.forEach(filteredSpecs, function(spec) {
									var newVol = $scope.volumeCube(0.7, spec.min, spec.max, spec.length, 'mm');
									vol += newVol;
								});
								
							} else if (product === 'SAW') {
								var filteredProducts = $filter('filter')(tally.stock, { product_name: product});
								angular.forEach(filteredProducts, function(spec) {
									var newVol = $scope.volumeCube(0.8, spec.min, spec.max, spec.length, 'cm');
									vol += newVol;
								});
							} else {
								var filteredProducts = $filter('filter')(tally.stock, { product_name: product});
								angular.forEach(filteredProducts, function(spec) {
									var newVol = $scope.volumeCube(0.7, spec.min, spec.max, spec.length, 'mm');
									vol += newVol;
								});
							}

								
						} else {
							return;
						}
					});


					return vol;
				};

				$scope.getProductTotalDay= function(array, product) {
				var total = 0;

				angular.forEach(array, function(tally){				
					if (tally.stock) {
						if (product === 'B&F_457') {
							var spec = /[0-9]+/g.exec(product);
							var specProduct = /[\w]&[\w]/g.exec(product);
							
							var filteredProducts = $filter('filter')(tally.stock, { product_name: specProduct[0]});
							var filteredSpecs = $filter('filter')(filteredProducts, { sabs: spec[0]});
							angular.forEach(filteredSpecs, function(spec) {
								total += spec.total;
							});
							
						} else if (product === 'B&F_1288') {
							var spec = /[0-9]+/g.exec(product);
							var specProduct = /[\w]&[\w]/g.exec(product);
							
							var filteredProducts = $filter('filter')(tally.stock, { product_name: specProduct[0]});
							var filteredSpecs = $filter('filter')(filteredProducts, { sabs: spec[0]});
							angular.forEach(filteredSpecs, function(spec) {
								total += spec.total;
							});
							
						} else {
							var filteredProducts = $filter('filter')(tally.stock, { product_name: product});
							angular.forEach(filteredProducts, function(spec) {
								total += spec.total;
							});
						}

							
					} else {
						return;
					}
				});


				return total;
				// var filteredProducts = $filter('filter')(array, { product_name})
			};


				$scope.getTotalDayVol = function(array) {
					var totalVol = 0;
					angular.forEach(array, function(tally){
						angular.forEach(tally.stock, function(stockItem){
							if (tally.stock) {
							if (stockItem.product_name === 'SAW') {
								var ItemVol = $scope.volumeCube(0.8, stockItem.min, stockItem.max, stockItem.length, 'cm');
								totalVol += ItemVol;
							} else if (stockItem.product_name === 'B&F') {
								var ItemVol = $scope.volumeCube(0.7, stockItem.min, stockItem.max, stockItem.length, 'mm');
								totalVol += ItemVol;
							} else if (stockItem.product_name === 'Tomato_Pole') {
								var ItemVol = $scope.volumeCube(0.7, stockItem.min, stockItem.max, stockItem.length, 'mm');
								totalVol += ItemVol;
							} else if (stockItem.product_name === 'Dropper') {
								var ItemVol = $scope.volumeCube(0.7, stockItem.min, stockItem.max, stockItem.length, 'mm');
								totalVol += ItemVol;
							} else if (stockItem.product_name === 'Lath') {
								var ItemVol = $scope.volumeCube(0.7, stockItem.min, stockItem.max, stockItem.length, 'mm');
								totalVol += ItemVol;
							}

								
						} else {
							return;
						}
						});
					});

					return totalVol;
				};

				$scope.getDayTotal = function(array) {
				      	var total = 0;

				      	angular.forEach(array, function(tally){
				      		angular.forEach(tally.stock, function(stockItem) {
					      		total += stockItem.total;
					      	});
				      	});
				      	
				      	return total;
				 };

				 $scope.getDaySizes = function(array, product) {
				 	var allsizes = [];
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

						
							angular.forEach(array, function(tally){

								if (product === 'B&F_457') {
									var spec = /[0-9]+/g.exec(product);
									var specProduct = /[\w]&[\w]/g.exec(product);

									var filteredProducts = $filter('filter')(tally.stock, { product_name: specProduct[0]});
									var filteredSpecs = $filter('filter')(filteredProducts, { sabs: spec[0]});
									
									angular.forEach(filteredSpecs, function(filteredItem) {
										var result = checkIfExist(allsizes, filteredItem.min);
										if (result === false) {
											allsizes.push(filteredItem.min);
										}
									});
									

								} else if (product === 'B&F_1288') {
									var spec = /[0-9]+/g.exec(product);
									var specProduct = /[\w]&[\w]/g.exec(product);

									var filteredProducts = $filter('filter')(tally.stock, { product_name: specProduct[0]});
									var filteredSpecs = $filter('filter')(filteredProducts, { sabs: spec[0]});
									angular.forEach(filteredSpecs, function(filteredItem) {
										var result = checkIfExist(allsizes, filteredItem.min);
										if (result === false) {
											allsizes.push(filteredItem.min);
										}
									});
									

								} else {
									var filteredProducts = $filter('filter')(tally.stock, { product_name: product});
									
									angular.forEach(filteredProducts, function(filteredItem) {
										var result = checkIfExist(allsizes, filteredItem.min);
										if (result === false) {
											allsizes.push(filteredItem.min);
										}
									});
								}


							});
							
							return allsizes;
		
				 };

				 $scope.getSizeDayVolume = function(array, product, size) {
				 	var vol = 0;

				 	angular.forEach(array, function(tally){

								if (product === 'B&F_457') {
									var spec = /[0-9]+/g.exec(product);
									var specProduct = /[\w]&[\w]/g.exec(product);

									var filteredProducts = $filter('filter')(tally.stock, { product_name: specProduct[0]});
									var filteredSpecs = $filter('filter')(filteredProducts, { sabs: spec[0]});
									var filteredSizes = $filter('filter')(filteredSpecs, { min: size});
									angular.forEach(filteredSizes, function(filteredItem) {
										var newVol = $scope.volumeCube(0.7, filteredItem.min, filteredItem.max, filteredItem.length, 'mm');
										vol += newVol;
									});
									

								} else if (product === 'B&F_1288') {
									var spec = /[0-9]+/g.exec(product);
									var specProduct = /[\w]&[\w]/g.exec(product);

									var filteredProducts = $filter('filter')(tally.stock, { product_name: specProduct[0]});
									var filteredSpecs = $filter('filter')(filteredProducts, { sabs: spec[0]});
									var filteredSizes = $filter('filter')(filteredSpecs, { min: size});
									angular.forEach(filteredSizes, function(filteredItem) {
										var newVol = $scope.volumeCube(0.7, filteredItem.min, filteredItem.max, filteredItem.length, 'mm');
										vol += newVol;
									});
									

								} else if (product === 'SAW') {
									var filteredProducts = $filter('filter')(tally.stock, { product_name: product});
									var filteredSizes = $filter('filter')(filteredProducts, { min: size});
									angular.forEach(filteredSizes, function(filteredItem) {
										var newVol = $scope.volumeCube(0.8, filteredItem.min, filteredItem.max, filteredItem.length, 'cm');
										vol += newVol;
									});
								} else {
									var filteredProducts = $filter('filter')(tally.stock, { product_name: product});
									var filteredSizes = $filter('filter')(filteredProducts, { min: size});
									angular.forEach(filteredSizes, function(filteredItem) {
										var newVol = $scope.volumeCube(0.7, filteredItem.min, filteredItem.max, filteredItem.length, 'mm');
										vol += newVol;
									});
								}


					});

					return vol;

				 };

				 $scope.getSizeDayTotal = function(array, product, size) {
				 	var total = 0;

				 	angular.forEach(array, function(tally){

								if (product === 'B&F_457') {
									var spec = /[0-9]+/g.exec(product);
									var specProduct = /[\w]&[\w]/g.exec(product);

									var filteredProducts = $filter('filter')(tally.stock, { product_name: specProduct[0]});
									var filteredSpecs = $filter('filter')(filteredProducts, { sabs: spec[0]});
									var filteredSizes = $filter('filter')(filteredSpecs, { min: size});
									angular.forEach(filteredSizes, function(filteredItem) {
										total += filteredItem.total;
									});
									

								} else if (product === 'B&F_1288') {
									var spec = /[0-9]+/g.exec(product);
									var specProduct = /[\w]&[\w]/g.exec(product);

									var filteredProducts = $filter('filter')(tally.stock, { product_name: specProduct[0]});
									var filteredSpecs = $filter('filter')(filteredProducts, { sabs: spec[0]});
									var filteredSizes = $filter('filter')(filteredSpecs, { min: size});
									angular.forEach(filteredSizes, function(filteredItem) {
										total += filteredItem.total;
									});
									

								} else if (product === 'SAW') {
									var filteredProducts = $filter('filter')(tally.stock, { product_name: product});
									var filteredSizes = $filter('filter')(filteredProducts, { min: size});
									angular.forEach(filteredSizes, function(filteredItem) {
										total += filteredItem.total;
									});
								} else {
									var filteredProducts = $filter('filter')(tally.stock, { product_name: product});
									var filteredSizes = $filter('filter')(filteredProducts, { min: size});
									angular.forEach(filteredSizes, function(filteredItem) {
										total += filteredItem.total;
									});
								}


					});

					return total;

				 };


		      },
		      size: size,
		      resolve: {
		        tallies: function () {
		          return $scope.tallies;
		        },
		        productsList : function () {
		        	return $scope.productsList;
		        }
		      }
		    });
			
			
		};

		this.openTallyReport = function (size, tally) {
			
				
				var modalInstance = $modal.open({
		      animation: $scope.animationsEnabled,
		      templateUrl: 'modules/tallies/views/tallyreport.client.view.html',
		      controller: function ($scope, $modalInstance, tally, Volume) {
		      		$scope.tally = tally;
		      		$scope.volumeCube = Volume.cubicMeter; 
		      	
		      	    $scope.generateProductsTally = function(tally) {
				      	var productsInTime = [];
						
						

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

						
							angular.forEach(tally.stock, function(stockItem){
								var productsLength = productsInTime.length;
								if (stockItem.product_name === 'B&F') {
									var newproduct = stockItem.product_name +  '_' + stockItem.sabs;
									if ( productsLength === 0 ) {
										productsInTime.push(newproduct);
									} else if (productsLength > 0) {
										var result = checkIfExist(productsInTime, newproduct);
										if (result === false) {
											productsInTime.push(newproduct);
										} 
									}
								} else {
									var newproduct = stockItem.product_name;
									if ( productsLength === 0 ) {
										productsInTime.push(newproduct);
									} else if (productsLength > 0) {
										var result = checkIfExist(productsInTime, newproduct);
										if (result === false) {
											productsInTime.push(newproduct);
										} 
									}
								}
								


								
							});
						

						$scope.tallyProducts = productsInTime;
						
				      };

				      $scope.getTotalVolT = function(tally) {
				      	
				      	var vol = 0 ; 
				      	angular.forEach(tally.stock, function(stockItem){
				      		if (stockItem.product_name === 'SAW') {
				      			var newVol = $scope.volumeCube(0.8, stockItem.min, stockItem.max, stockItem.length, 'cm');
				      			vol += newVol;
				      		} else {
				      			var newVol = $scope.volumeCube(0.7, stockItem.min, stockItem.max, stockItem.length, 'mm');
				      			vol += newVol;
				      		}
				      	});

				      	return vol;
				      };

				      $scope.getTotalAll = function(tally) {
				      	var total = 0;

				      	angular.forEach(tally.stock, function(stockItem) {
				      		total += stockItem.total;
				      	});
				      	return total;
				      };

				      $scope.generateProductsTally($scope.tally);

				      $scope.getProductVolT = function(tallyProducts, product) {

				      	
								var vol = 0;

							
								if (product === 'B&F_457') {
									var spec = /[0-9]+/g.exec(product);
									var specProduct = /[\w]&[\w]/g.exec(product);
			
									var filteredProducts = $filter('filter')(tallyProducts, { product_name: specProduct[0]});
									var filteredSpecs = $filter('filter')(filteredProducts, { sabs: spec[0]});
									angular.forEach(filteredSpecs, function(spec) {
										var newVol = $scope.volumeCube(0.7, spec.min, spec.max, spec.length, 'mm');
										vol += newVol;
									});
									
								} else if (product === 'B&F_1288') {
									var spec = /[0-9]+/g.exec(product);
									var specProduct = /[\w]&[\w]/g.exec(product);
									
									var filteredProducts = $filter('filter')(tallyProducts, { product_name: specProduct[0]});
									var filteredSpecs = $filter('filter')(filteredProducts, { sabs: spec[0]});
									angular.forEach(filteredSpecs, function(spec) {
										var newVol = $scope.volumeCube(0.7, spec.min, spec.max, spec.length, 'mm');
										vol += newVol;
									});
									
								} else if (product === 'SAW') {
									var filteredProducts = $filter('filter')(tallyProducts, { product_name: product});
									angular.forEach(filteredProducts, function(spec) {
										var newVol = $scope.volumeCube(0.8, spec.min, spec.max, spec.length, 'cm');
										vol += newVol;
									});
								} else {
									var filteredProducts = $filter('filter')(tallyProducts, { product_name: product});
									angular.forEach(filteredProducts, function(spec) {
										var newVol = $scope.volumeCube(0.7, spec.min, spec.max, spec.length, 'mm');
										vol += newVol;
									});
								}

									

						return vol;
					};

					$scope.getProductTotalT = function(tallyProducts, product) {
								var total = 0;
							
								if (product === 'B&F_457') {
									var spec = /[0-9]+/g.exec(product);
									var specProduct = /[\w]&[\w]/g.exec(product);
									
									var filteredProducts = $filter('filter')(tallyProducts, { product_name: specProduct[0]});
									var filteredSpecs = $filter('filter')(filteredProducts, { sabs: spec[0]});
									
									angular.forEach(filteredSpecs, function(spec) {
										total += spec.total;
									});
									
								} else if (product === 'B&F_1288') {
									var spec = /[0-9]+/g.exec(product);
									var specProduct = /[\w]&[\w]/g.exec(product);
									
									var filteredProducts = $filter('filter')(tallyProducts, { product_name: specProduct[0]});
									var filteredSpecs = $filter('filter')(filteredProducts, { sabs: spec[0]});
									angular.forEach(filteredSpecs, function(spec) {
										total += spec.total;
									});
									
								} else {
									var filteredProducts = $filter('filter')(tallyProducts, { product_name: product});
									angular.forEach(filteredProducts, function(spec) {
										total += spec.total;
									});
								}

									
							
						


						return total;
						// var filteredProducts = $filter('filter')(array, { product_name})
					};

					$scope.getSizeVolume = function(tally, product, size) {
						var vol = 0;

						var tallyProducts = tally.stock;

						if (product === 'B&F_457') {
							var spec = /[0-9]+/g.exec(product);
							var specProduct = /[\w]&[\w]/g.exec(product);
	
							var filteredProducts = $filter('filter')(tallyProducts, { product_name: specProduct[0]});
							var filteredSpecs = $filter('filter')(filteredProducts, { sabs: spec[0]});
							var filteredSizes = $filter('filter')(filteredSpecs, { min: size});
							angular.forEach(filteredSizes, function(spec) {
								var newVol = $scope.volumeCube(0.7, spec.min, spec.max, spec.length, 'mm');
								vol += newVol;
							});
							
						} else if (product === 'B&F_1288') {
							var spec = /[0-9]+/g.exec(product);
							var specProduct = /[\w]&[\w]/g.exec(product);
							
							var filteredProducts = $filter('filter')(tallyProducts, { product_name: specProduct[0]});
							var filteredSpecs = $filter('filter')(filteredProducts, { sabs: spec[0]});
							var filteredSizes = $filter('filter')(filteredSpecs, { min: size});
							angular.forEach(filteredSizes, function(spec) {
								var newVol = $scope.volumeCube(0.7, spec.min, spec.max, spec.length, 'mm');
								vol += newVol;
							});
							
						} else if (product === 'SAW') {
							var filteredProducts = $filter('filter')(tallyProducts, { product_name: product});
							var filteredSizes = $filter('filter')(filteredProducts, { min: size});
							angular.forEach(filteredSizes, function(spec) {
								var newVol = $scope.volumeCube(0.8, spec.min, spec.max, spec.length, 'cm');
								vol += newVol;
							});
						} else {
							var filteredProducts = $filter('filter')(tallyProducts, { product_name: product});
							var filteredSizes = $filter('filter')(filteredProducts, { min: size});
							angular.forEach(filteredSizes, function(spec) {
								var newVol = $scope.volumeCube(0.7, spec.min, spec.max, spec.length, 'mm');
								vol += newVol;
							});
						}

						return vol;

					};


					$scope.getSizeTotalTally = function(tally, product, size) {
						var total = 0;

						var tallyProducts = tally.stock;

						if (product === 'B&F_457') {
							var spec = /[0-9]+/g.exec(product);
							var specProduct = /[\w]&[\w]/g.exec(product);
							
							var filteredProducts = $filter('filter')(tallyProducts, { product_name: specProduct[0]});
							var filteredSpecs = $filter('filter')(filteredProducts, { sabs: spec[0]});
							var filteredSizes = $filter('filter')(filteredSpecs, { min: size});
							angular.forEach(filteredSizes, function(spec) {
								total += spec.total;
							});
							
						} else if (product === 'B&F_1288') {
							var spec = /[0-9]+/g.exec(product);
							var specProduct = /[\w]&[\w]/g.exec(product);
							
							var filteredProducts = $filter('filter')(tallyProducts, { product_name: specProduct[0]});
							var filteredSpecs = $filter('filter')(filteredProducts, { sabs: spec[0]});
							var filteredSizes = $filter('filter')(filteredSpecs, { min: size});
							angular.forEach(filteredSizes, function(spec) {
								total += spec.total;
							});
							
						} else {
							var filteredProducts = $filter('filter')(tallyProducts, { product_name: product});
							var filteredSizes = $filter('filter')(filteredProducts, { min: size});
							angular.forEach(filteredSizes, function(spec) {
								total += spec.total;
							});
						}

						return total;

					};




		      },
		      size: size,
		      resolve: {
		        tally: function () {
		          return tally;
		        }
		      }
		    });

			
			
		    

		    
		  };


		$scope.showSimpleToast = function() {
	    $mdToast.show(
	      $mdToast.simple()
	        .content('Simple Toast!')
	        .position($scope.getToastPosition())
	        .hideDelay(3000)
	    );
	  };

	  	$scope.isOpen = false;
      $scope.demo = {
        isOpen: false,
        count: 0,
        selectedAlignment: 'md-left'
      };

		$scope.colors = ['#149588', '#ff6666', '#f1b44b', '#26C6DA', '#D4E157'];

		$scope.activeTab = [];
 
		    //check if the tab is active
		    $scope.isOpenTab = function (index) {
		        //check if this tab is already in the activeTab array
		        if ($scope.activeTab[0] === index) {
		        	return true;
		        } else {
		        	return false;
		        }
		    };
		 
		    //function to 'open' a tab
		    $scope.openTab = function (index) {
		        //Check if tabs is already open if 
		        if ($scope.isOpenTab(index)) {
		            $scope.activeTab.splice(0, $scope.activeTab.length);
		        } else {
		            //if it's not, splice it!
		            $scope.activeTab.splice(0, $scope.activeTab.length, index);
		            
		        }
	    	};

		// $scope.colors = ['#FF7043' , '#01579B', '']

		$scope.getRandomColour = function(){
		  return Math.floor((Math.random()*6)+1);
		}

		// first init
		$scope.volumeCube = Volume.cubicMeter; 
		
		//Scope Colors for anything
		$scope.standard = '#ECEFF1';
		$scope.dgrey = '#37474F';
		$scope.red = '#FF3D00';

		// Some repeat Data
		$scope.months = [{name: 'Jan', active: false,  m_value: '01'}, {name: 'Feb', active: false, m_value: '02'}, {name: 'Mar', active: false, m_value: '03'}, {name: 'Apr', active: false, m_value: '04'}, {name: 'May', active: false, m_value: '05'}, {name: 'Jun', active: false, m_value: '06'}, {name: 'Jul', active: false, m_value: '07'}, {name: 'Aug', active: false, m_value: '08'}, {name: 'Sep', active: false, m_value: '09'}, {name: 'Oct', active: false, m_value: '10'}, {name: 'Nov', active: false, m_value: '11'}, {name: 'Dec', active: false, m_value: '12'}];
		$scope.days = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
		$scope.years = ['2015', '2016', '2017', '2018'];
		
		// initialize values
		$scope.currentYear = moment().format('YYYY');
		$scope.currentMonth = moment().format('MM');
		$scope.selectedYear = moment().format('YYYY');

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



		$scope.generateDays = function(array, selectedYear, selectedMonth) {
			// We have filtered all tallies to down to year and month
			var talliesInMonth = $filter('filter')(array, { created: selectedYear + '-' + selectedMonth});
			// we adding days to this array
			var days = [];

			function checkIfExist(a, d) {
				var result = false;
				var alength = a.length;
				for (var j = 0; j < alength; j++ ) {
					var testDay = a[j];
					if (d === testDay) {
						result = true;
					}
				}

				return result; 	
			};

			angular.forEach(talliesInMonth, function(tally, i){
				var daysLength = days.length;
				var day = moment(tally.created).format('DD');
				
				if (daysLength === 0 ) {
					days.push(day);
				} else if (daysLength > 0) {
					var result = checkIfExist(days, day);
					if (result === false) {
						days.push(day);
					} 
				}
			});

			$scope.daysInMonth = days;
			// $scope.generateDayTallies(array, selectedYear, selectedMonth);
			// $scope.generateMonthlyTallies(array, selectedYear, selectedMonth);
		};

		// ================ end of generateDays ===============

		$scope.dailyTallies = [
				// {date: , total: , totalVol: , bfVol: , bfTotal: , sawVol, sawTotal: , products: [{name: B&F/SAW/Tomato/lath/dropper, spec: '', l: , w: , total: }] }
		];

		$scope.generateDayTallies = function(array, year, month, day) {
			$scope.dailyTallies = [];
			$scope.dailyTallies = $filter('filter')(array, { created: year + '-' + month + '-' + day});
			


		};

		$scope.monthlyTallies = [
				// {date: , total: , totalVol: , bfVol: , bfTotal: , sawVol, sawTotal: , products: [{name: B&F/SAW/Tomato/lath/dropper, spec: '', l: , w: , total: }] }
		];

		$scope.generateMonthlyTallies = function(array, selectedYear, selectedMonth) {

			$scope.selMonth = selectedMonth;

			$scope.monthlyTallies = [
				// {date: , total: , totalVol: , bfVol: , bfTotal: , sawVol, sawTotal: , products: [{name: B&F/SAW/Tomato/lath/dropper, spec: '', l: , w: , total: }] }
			];

			$scope.totalMonthlytallies = 0;

			$scope.monthlyTallies = $filter('filter')(array, { created: selectedYear + '-' + selectedMonth.m_value});
			console.log($scope.monthlyTallies);
			angular.forEach($scope.monthlyTallies, function(tally) {
				angular.forEach(tally.stock, function(item) {
					$scope.totalMonthlytallies += 1;
				});
			});

			$scope.generateDays(array, selectedYear, selectedMonth.m_value);
			$scope.makeProductsList($scope.monthlyTallies);

			// 1.we are going to filter for each day while looping through days array
			
				
				// 	var total = talliesInMonth.length;
				// 	var totalSawVol = 0;
				// 	var totalSaw = 0;
				// 	var totalBfVol = 0;
				// 	var totalBF = 0;
				// 	var totalTomatoVol = 0;
				// 	var totalTomato = 0;
				// 	var totalDropperVol = 0;
				// 	var totalDropper = 0;
				// 	var totalLathVol = 0;
				// 	var totalLath = 0;
				// 	var totalVol = 0;
				// 	var products = [];
				// 	var ItemVol = 0;

				// angular.forEach(talliesInMonth, function(tallyObj, i){
				// 	// all initialization thats has to happen
					

				// 	angular.forEach(tallyObj.stock, function(item){
				// 		// 1. push new object
				// 		// 2. calculate vol
				// 		products.push(item);

				// 		if (item.product_name === 'SAW') {
				// 			ItemVol = $scope.volumeCube(0.8, item.min, item.max, item.length, 'cm');
				// 			totalSawVol += ItemVol;
				// 			totalSaw += 1;
				// 			totalVol += ItemVol;
				// 		} else if (item.product_name === 'B&F') {
				// 			ItemVol = $scope.volumeCube(0.7, item.min, item.max, item.length, 'mm');
				// 			totalBfVol += ItemVol;
				// 			totalBF += 1;
				// 			totalVol += ItemVol;
				// 		} else if (item.product_name === 'Tomato_Pole') {
				// 			ItemVol = $scope.volumeCube(0.7, item.min, item.max, item.length, 'mm');
				// 			totalTomatoVol += ItemVol;
				// 			totalTomato += 1;
				// 			totalVol += ItemVol;
				// 		} else if (item.product_name === 'Dropper') {
				// 			ItemVol = $scope.volumeCube(0.7, item.min, item.max, item.length, 'mm');
				// 			totalDropperVol += ItemVol;
				// 			totalDropper += 1;
				// 			totalVol += ItemVol;
				// 		} else if (item.product_name === 'Lath') {
				// 			ItemVol = $scope.volumeCube(0.7, item.min, item.max, item.length, 'mm');
				// 			totalLathVol += ItemVol;
				// 			totalLath += 1;
				// 			totalVol += ItemVol;
				// 		}


				// 	});

				// 	// We have to now push this onto dailyTallies
				// 	// Prep objects
					
					

				// });
				
				// var newTally = {
				// 		total: total,
				// 		totalVol: totalVol,
				// 		bfVol: totalBfVol,
				// 		bfTotal: totalBF,
				// 		sawVol: totalSawVol,
				// 		sawTotal: totalSaw,
				// 		tomatoVol: totalTomatoVol,
				// 		tomatoTotal: totalTomato,
				// 		dropperVol: totalDropperVol,
				// 		dropperTotal: totalDropper,
				// 		lathVol: totalLathVol,
				// 		lathTotal: totalLath,
				// 		products: products
				// 	};


				// $scope.monthlyTallies.push(newTally);
			
			
				
			
				// console.log($scope.monthlyTallies);


		};

		$scope.makeProductsList = function(array) {
			var productsInTime = [];
			
			

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

			angular.forEach(array, function(tally) {
				angular.forEach(tally.stock, function(stockItem){
					var productsLength = productsInTime.length;
					if (stockItem.product_name === 'B&F') {
						var newproduct = stockItem.product_name +  '_' + stockItem.sabs;
						if ( productsLength === 0 ) {
							productsInTime.push(newproduct);
						} else if (productsLength > 0) {
							var result = checkIfExist(productsInTime, newproduct);
							if (result === false) {
								productsInTime.push(newproduct);
							} 
						}
					} else {
						var newproduct = stockItem.product_name;
						if ( productsLength === 0 ) {
							productsInTime.push(newproduct);
						} else if (productsLength > 0) {
							var result = checkIfExist(productsInTime, newproduct);
							if (result === false) {
								productsInTime.push(newproduct);
							} 
						}
					}
					


					
				});
			});


			$scope.productsList = productsInTime;

			// $scope.groupProducts($scope.productsList, $scope.monthlyTallies);

		};





		// $scope.groupProducts = function(productsList, talliesArray) {
		// 	console.log(talliesArray);

		// 	var products = [
		// 		// {name: , sabs: , total: , vol: , specs: [{min: , max: , vol: , total: , lengths[]}]}
		// 	];
		// 	angular.forEach(productsList, function(productItem, i) {
		// 		angular.forEach(talliesArray, function(tallyItem){
		// 			var filteredProducts = $filter('filter')(tallyItem.products, { product_name: productItem });
		// 			var productCollector = [];
		// 			angular.forEach(filteredProducts, function(filterProduct){
		// 				function getVol(taper, min, max, length, unit) {

		// 				};

		// 				var pcLength = productCollector.length;
		// 				var specs = [];
		// 				var lengths = [];
		// 				var newObj = {
		// 						name: filterProduct.product_name,
		// 						sabs: filterProduct.sabs,
		// 						total: 0,
		// 						vol: 0,
		// 						specs: specs
		// 					};
		// 				if (pcLength === 0) {
		// 					if (filterProduct.product_name === 'SAW') {
		// 						var taper = 
		// 					}
		// 					specs.push({
		// 						min: filterProduct.min,
		// 						max: filterProduct.max,
		// 						vol: 
		// 					});
							
		// 					productCollector.push(newObj);	
		// 				} else if ( pcLength > 0 ) {

		// 				} 
		// 			});
		// 		});
				
				
		// 	});
		// };


			$scope.getTotalVolume = function(array) {
				var totalVol = 0;
				angular.forEach(array, function(tally){
					angular.forEach(tally.stock, function(stockItem){
						if (tally.stock) {
						if (stockItem.product_name === 'SAW') {
							var ItemVol = $scope.volumeCube(0.8, stockItem.min, stockItem.max, stockItem.length, 'cm');
							totalVol += ItemVol;
						} else if (stockItem.product_name === 'B&F') {
							var ItemVol = $scope.volumeCube(0.7, stockItem.min, stockItem.max, stockItem.length, 'mm');
							totalVol += ItemVol;
						} else if (stockItem.product_name === 'Tomato_Pole') {
							var ItemVol = $scope.volumeCube(0.7, stockItem.min, stockItem.max, stockItem.length, 'mm');
							totalVol += ItemVol;
						} else if (stockItem.product_name === 'Dropper') {
							var ItemVol = $scope.volumeCube(0.7, stockItem.min, stockItem.max, stockItem.length, 'mm');
							totalVol += ItemVol;
						} else if (stockItem.product_name === 'Lath') {
							var ItemVol = $scope.volumeCube(0.7, stockItem.min, stockItem.max, stockItem.length, 'mm');
							totalVol += ItemVol;
						}

							
					} else {
						return;
					}
					});
				});

				return totalVol;
			};

			$scope.getProductTotal = function(array, product) {
				var total = 0;

				angular.forEach(array, function(tally){				
					if (tally.stock) {
						if (product === 'B&F_457') {
							var spec = /[0-9]+/g.exec(product);
							var specProduct = /[\w]&[\w]/g.exec(product);
							
							var filteredProducts = $filter('filter')(tally.stock, { product_name: specProduct[0]});
							var filteredSpecs = $filter('filter')(filteredProducts, { sabs: spec[0]});
							angular.forEach(filteredSpecs, function(spec) {
								total += 1;
							});
							
						} else if (product === 'B&F_1288') {
							var spec = /[0-9]+/g.exec(product);
							var specProduct = /[\w]&[\w]/g.exec(product);
							
							var filteredProducts = $filter('filter')(tally.stock, { product_name: specProduct[0]});
							var filteredSpecs = $filter('filter')(filteredProducts, { sabs: spec[0]});
							angular.forEach(filteredSpecs, function(spec) {
								total += 1;
							});
							
						} else {
							var filteredProducts = $filter('filter')(tally.stock, { product_name: product});
							angular.forEach(filteredProducts, function(spec) {
								total += 1;
							});
						}

							
					} else {
						return;
					}
				});


				return total;
				// var filteredProducts = $filter('filter')(array, { product_name})
			};




			$scope.getProductVolume = function(array, product) {
				var vol = 0;

				angular.forEach(array, function(tally){				
					if (tally.stock) {
						if (product === 'B&F_457') {
							var spec = /[0-9]+/g.exec(product);
							var specProduct = /[\w]&[\w]/g.exec(product);
	
							var filteredProducts = $filter('filter')(tally.stock, { product_name: specProduct[0]});
							var filteredSpecs = $filter('filter')(filteredProducts, { sabs: spec[0]});
							angular.forEach(filteredSpecs, function(spec) {
								var newVol = $scope.volumeCube(0.7, spec.min, spec.max, spec.length, 'mm');
								vol += newVol;
							});
							
						} else if (product === 'B&F_1288') {
							var spec = /[0-9]+/g.exec(product);
							var specProduct = /[\w]&[\w]/g.exec(product);
							
							var filteredProducts = $filter('filter')(tally.stock, { product_name: specProduct[0]});
							var filteredSpecs = $filter('filter')(filteredProducts, { sabs: spec[0]});
							angular.forEach(filteredSpecs, function(spec) {
								var newVol = $scope.volumeCube(0.7, spec.min, spec.max, spec.length, 'mm');
								vol += newVol;
							});
							
						} else if (product === 'SAW') {
							var filteredProducts = $filter('filter')(tally.stock, { product_name: product});
							angular.forEach(filteredProducts, function(spec) {
								var newVol = $scope.volumeCube(0.8, spec.min, spec.max, spec.length, 'cm');
								vol += newVol;
							});
						} else {
							var filteredProducts = $filter('filter')(tally.stock, { product_name: product});
							angular.forEach(filteredProducts, function(spec) {
								var newVol = $scope.volumeCube(0.7, spec.min, spec.max, spec.length, 'mm');
								vol += newVol;
							});
						}

							
					} else {
						return;
					}
				});


				return vol;
			};



			

			$scope.getLengthVolume = function (array, product, min, length) {

			};

			$scope.getTotalProducts = function(array, product) {

			};
		
	      $scope.toggleMonth = function (array, year, month, active) {
	      	var active = active;
	      	
	       	$scope.selectedMonths = filterFilter(array, { created: year + '-' + month });

			if (active === true) {
				// Then we need to add all of this items to the sampler
				angular.forEach($scope.selectedMonths, function(moTally) {
					$scope.selectedTallies.push(moTally);
				});
				
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

	     $scope.getTotalTallies = function(array, timeFrame, value) {
	     	var totalTallies = 0;
	     	if (timeFrame === 'year') {
	     		var filteredTallies = $filter('filter')(array, { created: value });
	     	} else if (timeFrame === 'month') {
	     		var filteredTallies = $filter('filter')(array, { created: $scope.selectedYear + '-' + value });
	     	} else if (timeFrame === 'day') {
	     		var filteredTallies = $filter('filter')(array, { created: $scope.selectedYear + '-' + $scope.selMonth.m_value + '-' + value });
	     	}


	     	var totalTallies = filteredTallies.length;

	     	return totalTallies;
	     };

	     $scope.getTotalVol = function (array, timeFrame, value) {
	     	var totalVol = 0;

	     	if (timeFrame === 'year') {
	     		var filteredTallies = $filter('filter')(array, { created: value });
	     	} else if (timeFrame === 'month') {
	     		var filteredTallies = $filter('filter')(array, { created: $scope.selectedYear + '-' + value });
	     	} else if (timeFrame === 'day') {
	     		var filteredTallies = $filter('filter')(array, { created: $scope.selectedYear + '-' + $scope.selMonth.m_value + '-' + value });
	     	}

	     	angular.forEach(filteredTallies, function(tally){
	     		angular.forEach(tally.stock, function(item){
	     			if (item.product_name === 'SAW') {
	     				
	     				var newVol = $scope.volumeCube(0.8, item.min, item.max, item.length, 'cm');
	     				totalVol += newVol;
	     			} else {
	     				var newVol = $scope.volumeCube(0.7, item.min, item.max, item.length, 'mm');
	     				totalVol += newVol;
	     			}
	     		});
	     	});

	     	return totalVol; 
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

	      $scope.generateProductsTally = function(tally) {
	      	var productsInTime = [];
			
			

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

			
				angular.forEach(tally.stock, function(stockItem){
					var productsLength = productsInTime.length;
					if (stockItem.product_name === 'B&F') {
						var newproduct = stockItem.product_name +  '_' + stockItem.sabs;
						if ( productsLength === 0 ) {
							productsInTime.push(newproduct);
						} else if (productsLength > 0) {
							var result = checkIfExist(productsInTime, newproduct);
							if (result === false) {
								productsInTime.push(newproduct);
							} 
						}
					} else {
						var newproduct = stockItem.product_name;
						if ( productsLength === 0 ) {
							productsInTime.push(newproduct);
						} else if (productsLength > 0) {
							var result = checkIfExist(productsInTime, newproduct);
							if (result === false) {
								productsInTime.push(newproduct);
							} 
						}
					}
					


					
				});
			

			$scope.tallyProducts = productsInTime;
			
	      };

	      $scope.findTally = function(id) {
			$scope.tally = Tallies.get({ 
				tallyId: id
			});

			$timeout(function(){
				$scope.generateProductsTally($scope.tally);
			}, 650);

		};

		$scope.find = function() {
			$scope.tallies = Tallies.query();
			// $timeout(function() {
			// 	$scope.editTallies($scope.tallies);
			// }, 1000);
		};

		
		$scope.getSizes = function(product) {

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

			function returnSizes(array) {
				
				var sizes = [];

				angular.forEach(array, function(item) {
					var sLen = sizes.length;
					if (sLen === 0) {
						sizes.push(item.min);
					} else if (sLen > 0) {
						var result = checkIfExist(sizes, item.min);
						if (result === false) {
							sizes.push(item.min);
						} 
					}
				});

				return sizes;

			};

			if (product === 'B&F_457') {
				var spec = /[0-9]+/g.exec(product);
				var specProduct = /[\w]&[\w]/g.exec(product);

				var filteredProducts = $filter('filter')($scope.tally.stock, { product_name: specProduct[0]});
				var filteredSpecs = $filter('filter')(filteredProducts, { sabs: spec[0]});
				var productSizes = returnSizes(filteredSpecs);
				

			} else if (product === 'B&F_1288') {
				var spec = /[0-9]+/g.exec(product);
				var specProduct = /[\w]&[\w]/g.exec(product);

				var filteredProducts = $filter('filter')($scope.tally.stock, { product_name: specProduct[0]});
				var filteredSpecs = $filter('filter')(filteredProducts, { sabs: spec[0]});
				var productSizes = returnSizes(filteredSpecs);

			} else {
				var filteredProducts = $filter('filter')($scope.tally.stock, { product_name: product});
				var productSizes = returnSizes(filteredProducts);
			}

			return productSizes;


		};



		$timeout(function(){
			$scope.collectMonths($scope.tallies, $scope.currentYear);
			$scope.setCurrentMonthActive();
		}, 1000);

	}




	
]);



