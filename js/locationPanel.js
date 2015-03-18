
define(function () {
	
    function locationPanel(div, app) {
  
        if (!(this instanceof locationPanel)) {
            throw new TypeError("locationPanel constructor cannot be called as a function.");
        }

	showError =  function(error) {
			console.log(error)
			switch(error.code) {
				case error.PERMISSION_DENIED:	        	
					alert("Your location is an important part of this application.  You don't need to share your location to view the results, but you will need to report a location to answer a question.")	        
					break;
				case error.POSITION_UNAVAILABLE:	        	
					alert("Your position was not available. Location is an important part of this application.  You don't need to have your location to view the results, but you will need to report a location to answer a question.")	        	          	
					break;
				case error.TIMEOUT:	           
					alert("Your position was not available. Location is an important part of this application.  You don't need to have your location to view the results, but you will need to report a location to answer a question.")	        	
					break;
				case error.UNKNOWN_ERROR:	            
					alert("Your position was not available. Location is an important part of this application.  You don't need to have your location to view the results, but you will need to report a location to answer a question.")	        	
					break;
			}
		};	
		
	setlocation = function(position) {	
		xlng = position.coords.longitude;
		ylat = position.coords.latitude;

		//app.curlatlon = "Point("+ xlng + " " + ylat +")";

		app.curlatlon = [xlng , ylat]
		console.log(app)
		
		$.getJSON( "http://nominatim.openstreetmap.org/reverse?format=json&lat=" + ylat + "&lon=" + xlng + "&zoom=18&addressdetails=1", function( data ) { 	 	    
			$("#locationReport").html( "<h5>Your answer location will be registered at or near:</h5><h6>" + data.display_name + "</h6>" );							
		})

		//locationMap = L.map('locMap', {trackResize:true, maxZoom:18}).setView([ylat, xlng], 15);

		//var locationLayer = L.tileLayer(
		//	'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {			
		//	maxZoom: 18,
		//})

		//locationMap.addLayer(locationLayer);		
	};
	
	
		this.div = $(div);
		this.currentLocationReport = $('<div id="locationReport"></div>');
		this.div.append(this.currentLocationReport)
		
		this.changeLocation = $('<div class="buttonLoc"><button type="submit" class="btn btn-default" id="updateLoc">Update Your Submission Location</button></div>')
		this.div.append(this.changeLocation)
		
		
		navigator.geolocation.getCurrentPosition(setlocation,showError);
		
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

	