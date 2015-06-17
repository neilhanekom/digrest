'use strict';

angular.module('core').directive('elheight', [ '$window', '$document', '$timeout',
	function($window, $document, $timeout) {
		return {
			restrict: 'EA',
			link: function postLink(scope, element, attrs) {

				var w = $(window);
				var el = $(element);
				var doc = $(document);
				$timeout(function(){
					var elHeight = $(element).height();
				}, 100);

				scope.$watch(function() {
					return {
						'elH': el.offsetHeight,
						'docH': doc.height()
					};
				}, function(newValue, oldValue) {
						var documentHeight = newValue.docH;
						var elementHeight = newValue.elH;
						if (documentHeight > elementHeight) {
							console.log(documentHeight);
							console.log(elementHeight);
							scope.resizedHeight = function () {
				                return { 
				                    'height': (documentHeight) + 'px'
				                    //,'width': (newValue.w - 100) + 'px' 
				                };
				            };
						} else if (elementHeight > documentHeight) {
							$document.height = elementHeight;
							console.log(documentHeight);
							console.log(elementHeight);
						}
				}, true);

				w.bind('elheight', function () {
		            scope.$apply();
		        });

				// scope.$watch(function() {
				// 	return {
						
				// 	};
				// }, function(newValue, oldValue) {
					
				// 	scope.newStyle = function () {

				// 	};

				// }, true);

			// 	var h = w.innerHeight;
			// 	console.log(h);
			// }
		
				}
			};
	}
]);