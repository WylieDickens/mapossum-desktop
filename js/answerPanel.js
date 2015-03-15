
define(function () {
	
    function answerPanel(id) {
    	
        if (!(this instanceof answerPanel)) {
            throw new TypeError("answerPanel constructor cannot be called as a function.");
        }
        
		this.div = $("#" + id);
		this.div.empty();
		this.mainDiv = $('<div class="answerMain"></div>');
		this.div.append(this.mainDiv);
		this.submit = $(' <button type="submit" class="btn btn-default" id="subAnswer">Submit</button>')
		this.locationMap = $('<div id="locMap"></div>');
		this.locationDiv = $('<div id="answerLocation"><b>You are located at or near:</b></div>');
		this.div.append(this.submit)
		this.div.append(this.locationDiv);
		this.div.append(this.locationMap);
		
    }
 
	answerPanel.makeRadio = function(answer) {			
		radioDiv = $('<input type="radio" name="ansRadio" id="answerRadio" value="'+answer.answerid+'"/>' + answer.answer + '<br>');
		return radioDiv
	}

	answerPanel.makeTitle = function(question) {		
		titleDiv = $('<b><h4>' + question + '</h4></b>');
		return titleDiv
	}


	// answerPanel.curLocation = function(location){
	// 	return location
	// }

	// answerPanel.setlocation = function(position) {	
	// 	xlng = position.coords.longitude;
	// 	ylat = position.coords.latitude;

	// 	curlatlon = "Point("+ xlng + " " + ylat +")";
	// 	console.log(curlatlon)
	// 	$.getJSON( "http://nominatim.openstreetmap.org/reverse?format=json&lat=" + ylat + "&lon=" + xlng + "&zoom=18&addressdetails=1", function( data ) { 	 	    
	// 		$("#answerLocation").html( "<small>Lat: " + ylat.toFixed(3) + " " + "Lon: " + xlng.toFixed(3) + "<br>" + "<br>Which is near:<br>" + data.display_name  + "</small>");
	// 		$("#answerLocation").html( "<small>Lat: " + ylat.toFixed(3) + " " + "Lon: " + xlng.toFixed(3) + "<br>" + "<br>Which is near:<br>" + data.display_name  + "</small>");				
	// 	})

	// 	locationMap = L.map('locMap', {trackResize:true, maxZoom:18}).setView([ylat, xlng], 15);

	// 	var locationLayer = L.tileLayer(
	// 		'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {			
	// 		maxZoom: 18,
	// 	})

	// 	locationMap.addLayer(locationLayer);
	// 	return curlatlon
	// }

	// function showError(error) {
	// 	console.log(error)
	//     switch(error.code) {
	//         case error.PERMISSION_DENIED:	        	
	//             alert("You must enable your location settings to use your current location.")	        
	//             break;
	//         case error.POSITION_UNAVAILABLE:	        	
	//             alert("Location information is unavailable.")	        	          	
	//             break;
	//         case error.TIMEOUT:	           
	//             alert("The request to get user location timed out.")	        	
	//             break;
	//         case error.UNKNOWN_ERROR:	            
	//             alert("An unknown error occurred.")	        	
	//             break;
	//     }
	// }	
	
 
    answerPanel.prototype = {

    	constructor: answerPanel,
     
		gotoQuestion: function(qid) {

			apdiv = this.mainDiv;
			
			x = 0;

			$.getJSON("http://services.mapossum.org/getanswers?qid=" + qid + "&callback=?", function(data) {
				$.each(data.data, function( index, value ) {
					if(value.answer != null){
						apdiv.append(answerPanel.makeRadio(value));
					}				
				})
			
			});			
			
		},

		setTitle: function(question){

			this.mainDiv.empty();
			qpdiv = this.mainDiv		
			qpdiv.append(answerPanel.makeTitle(question));
		},

		pushAnswer: function(qid, answerid, loc){
			
			$.getJSON( "http://services.mapossum.org/addresponse?qid=" + qid + "&answerid=" + answerid + "&location=" + loc + "&callback=?", function( data ) {  
				  d = new Date();
				  v = d.getTime();    	
			      mapossumLayer.options.v = v;
				  mapossumLayer.redraw();
			    });
		},



    };

    return answerPanel;
});