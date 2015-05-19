'use strict';

angular.module('core').directive('hoverclose', [
	function() {
		return {
			template: '<div></div>',
			restrict: 'E',
			link: function postLink(scope, element, attrs) {
				// Hoverclose directive logic
				// ...

				element.text('this is the hoverclose directive');
			}
		};
	}
]);