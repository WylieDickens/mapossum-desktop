
define(function () {

    function locationPanel(div, app) {

		this.loaded = false;

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
			this.loaded = true;

			$("#locationReport").html( "<h5>Your answer location is not set, You need to update it before you can answer questions.</h5>" );
		};

	setlocation = function(position) {
		xlng = position.coords.longitude;
		ylat = position.coords.latitude;

		//app.curlatlon = "Point("+ xlng + " " + ylat +")";

		app.curlatlon = [xlng , ylat]
		console.log(app)

		//updateLocation
	 this.updateLocation(ylat, xlng)
		//locationMap = L.map('locMap', {trackResize:true, maxZoom:18}).setView([ylat, xlng], 15);

		//var locationLayer = L.tileLayer(
		//	'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		//	maxZoom: 18,
		//})
		this.loaded = true;
		//locationMap.addLayer(locationLayer);
	};

	this.app = app;
		this.div = $(div);
		this.currentLocationReport = $('<div id="locationReport"></div>');
		this.div.append(this.currentLocationReport)

		this.changeLocation = $('<div class="buttonLoc"><button type="submit" class="btn btn-default" id="updateLoc">Update Your Submission Location</button></div>')
		this.div.append(this.changeLocation)

		sl = $.proxy(setlocation, this)
		se = $.proxy(showError, this)
		navigator.geolocation.getCurrentPosition(sl,se);

		$("#updateLoc").on("click", function() {
			transitionTo('findpanel');

			app.fp._focus();
		})

    }

	locationPanel.getLocation = function(location) {

		return curlatlon
	}

	locationPanel.moveLocation = function(location) {

		return curlatlon
	}




    locationPanel.prototype = {

    	constructor: locationPanel,

		_refresh: function() {

			if (this.loaded == true) {
				this.updateLocation(this.app.curlatlon[1], this.app.curlatlon[0]);
		  }

		},

		updateLocation: function(ylat, xlng) {

			xpos = Math.abs(xlng);
			ypos = Math.abs(ylat);

			if (xpos < 0.3 && ypos < 0.3) {
				$("#locationReport").html( "<h5>Your answer location is not set, You need to update it before you can answer questions.</h5>" );
				this.app.curlatlon = undefined;
			} else {

			$.getJSON( "http://nominatim.openstreetmap.org/reverse?format=json&lat=" + ylat + "&lon=" + xlng + "&zoom=18&addressdetails=1", function( data ) {
				$("#locationReport").html( "<h5>Your answer location will be registered at or near:</h5><h6>" + data.display_name + "</h6>" );
			})
		}

		}

    };

    return locationPanel;
});
