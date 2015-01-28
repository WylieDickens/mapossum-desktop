requirejs.config({
    appDir: ".",
    baseUrl: "js",
	shim : {
        "bootstrap" : { "deps" :['jquery'] },
		"bootstrapGrid" : { "deps" :['jquery'] }
    },
    paths: { 
        /* Load jquery from google cdn. On fail, load local file. */
        'jquery': ['//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min', 'libs/jquery-min'],
        'leaflet': '//cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.2/leaflet' ,
		"bootstrap" :  "//maxcdn.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min",
		"bootstrapGrid" :  "https://cdnjs.cloudflare.com/ajax/libs/jquery-bootgrid/1.1.4/jquery.bootgrid"
	//	https://cdnjs.cloudflare.com/ajax/libs/jquery-bootgrid/1.1.4/jquery.bootgrid.min.js
    }
});

define([
		'jquery', 
		'leaflet', 
		'bootstrap',
		"bootstrapGrid"
		], 
		function(
		$, 
		L, 
		bs,
		bg
		) {
	
  	console.log("loaded");
   
	var MAP
   
    setup = function() {
   
		doLayout();
		
		MAP = L.map('mappanel', {trackResize:true, maxZoom:18}).setView([31.328920, -89.333514], 10);
		
		var bwlayer = L.tileLayer(
					'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
					//attribution: '&copy; Mapossum',
					maxZoom: 18,
					})
		
		MAP.addLayer(bwlayer);
		
		$(".controlbutton").click(function(e){
		
			if (e.target.className == "controltitle") {
				targetOut = e.target.parentElement.id;
			} else {
				targetOut = e.target.id;
			};
			transitionTo(targetOut);
			
		});
		
		transitionTo("mapbutton");
		 $('[data-toggle="tooltip"]').tooltip();
		 
		$("#grid-data").bootgrid({
			ajax: true,
			requestHandler: function (request) {
			
				request.count = 10; //number being requested as specified on Server
				console.log(request);
				return(request);
			},
			responseHandler: function (response)
			{
				response.rows = response.data;
				response.current = 1; //page
				response.total = 20; //total
				response.rowCount = response.rows.length;  //number of rows in output
				console.log(response);
				return response;
			},
			url: "http://services.mapossum.org/getquestions",
			formatters: {
				"link": function(column, row)
				{
					return "<a href=\"#\">" + column.id + ": " + row.id + "</a>";
				}
			}
		});

    }
  
    $( document ).ready( setup )
	
	
	$( window ).resize(function() {
		doLayout();
	});
	
	transitionTo = function(buttonClicked) {

			console.log("You clicked " + buttonClicked);
				
				panel = "#" + buttonClicked.replace("button","panel");
				
				$( ".controlpanel" ).each(function( index, el ) {
					if ( "#" + el.id != panel ) { 
					
						$( el ).animate({
							opacity: 0,
						}, 400, function() {
							$(el).hide();
						});
					
					
					};
				});
				
				$( ".controlbutton" ).each(function( index, el ) {
					curop = $(el).css( "opacity" );
					if ( el.id == buttonClicked ) { 
					
						$( el ).animate({
							opacity: 1,
						}, 300, function() {
						
						});
				
					} else {
					
						$( el ).animate({
							opacity: 0.6,
						}, 300, function() {
						
						});
					
					}
				});
				
				
	
				$( panel ).css({"opacity": 0});
				$( panel ).show();
				
				  $( panel ).animate({
					opacity: 1,
				  }, 400, function() {

				  });

	}
	
	doLayout = function() {
		mapwidth = $( window ).width() - $( "#control" ).width(); //- 5;
		maphieght = $( window ).height() - $( "#header" ).height() - $( "#footer" ).height();
		$( "#mainpanel" ).css({"width": mapwidth + "px"});
		$( "#mainpanel" ).css({"height": maphieght + "px"});
		$( "#control" ).css({"height": maphieght + "px"});	
	};
     
      
    return {};
    
});
