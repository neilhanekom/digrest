'use strict';

angular.module('core').factory('Volume', [
	function() {
		// Volume service logic
		// ...

		// Public API
	 	var round = function roundToSix(num) {    
		      return +(Math.round(num + "e+6")  + "e-6");
		      }

		  return {
		    cubicMeter: function(taper, min, max, length, unit) {
		      if (unit === 'mm') {
		        min = min/10;
		        max = max/10 
		      }
		      var pie = 3.14159;
		      var diaMid = (min + max)/2;
		      var vol = (((Math.pow(diaMid + (0.5 * taper * length), 2))*length)*pie)/40000;
		      // var vol = round(vol);
		      return vol;
		    },
		    getVolume: function(product, min, max, length){
		    	if (product === "B&F") {
		    		var taper = 0.7;
		    		min = min/10;
		    		max = max/10;
		    	} else if (product === "SAW") {
		    		var taper = 0.8;
		    	}

	    		var pie = 3.14159;
		      	var diaMid = (min + max)/2;
		      	var vol = (((Math.pow(diaMid + (0.5 * taper * length), 2))*length)*pie)/40000;

		      	return vol;
		    }


		  };
	}
]);