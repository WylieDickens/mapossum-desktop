
define(function () {
	
    function moCharts(div, app) {
  
        if (!(this instanceof moCharts)) {
            throw new TypeError("moCharts constructor cannot be called as a function.");
        }

		this.div = $(div);

		
    }
 


 
    moCharts.prototype = {

    	constructor: moCharts
     
		
    };
	
    return moCharts;
});

	