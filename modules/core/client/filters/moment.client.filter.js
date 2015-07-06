'use strict';

angular.module('core').filter('Moment', [
	function() {
		return function(date) {
        return moment(date).format('DD MMM YYYY');
      };
	}
]);