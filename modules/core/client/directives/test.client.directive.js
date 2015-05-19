'use strict';

angular.module('core').directive('test', [ '$window', '$document', '$timeout',
	function($window, $document, $timeout) {
		return {
			
				restrict: 'EA',
				transclude: true,
				template: '<div ng-transclude></div>',
				link: function postLink(scope, element, attrs) {
					var ele = angular.element(element);
					console.log(ele);
				}
			};
	}
]);