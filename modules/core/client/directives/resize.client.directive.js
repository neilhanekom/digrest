'use strict';

angular.module('core').directive('resize', [ '$window', '$document', '$timeout',
	function($window, $document, $timeout) {
		return {
			
				restrict: 'EA',
				link: function postLink(scope, element, attrs) {
					
					var window = $window;
					
					var h = $window.innerHeight;

					console.log(h);				

			        scope.fullHeight = function() {

			        	return {
			        		'height': (h) + 'px'
			        	};
			        };
					
				}
			};
	}
]);