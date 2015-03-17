
define(function () {
	
    function locationPanel(id, app) {
    	
        if (!(this instanceof locationPanel)) {
            throw new TypeError("locationPanel constructor cannot be called as a function.");
        }
        
		
		console.log('here')
    }
 
	locationPanel.getLocation = function(location) {			
		
		return curlatlon
	}

	locationPanel.moveLocation = function(location) {			
		
		return curlatlon
	}
	

 
    locationPanel.prototype = {

    	constructor: locationPanel,
     
		updateLocation: function(qid) {

					
			
		}

    };

    return locationPanel;
});