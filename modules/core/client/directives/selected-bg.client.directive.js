'use strict';

angular.module('core').directive('selectedBg', [
	function() {
		return {
			template: '<div></div>',
			restrict: 'E',
			link: function postLink(scope, element, attrs) {
				// Selected bg directive logic
				// ...

				element.text('this is the selectedBg directive');
			}
		};
	}
]);