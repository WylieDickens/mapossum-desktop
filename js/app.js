requirejs.config({
    appDir: ".",
    baseUrl: "js",
	shim : {
        "bootstrap" : { "deps" :['jquery'] }
    },
    paths: { 
        /* Load jquery from google cdn. On fail, load local file. */
        'jquery': ['//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min', 'libs/jquery-min'],
        'leaflet': '//cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.2/leaflet' ,
		"bootstrap" :  "//maxcdn.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min"  
    }
});

define(['jquery', 'leaflet', 'bootstrap'], function($, L, bs) {
    
	
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
		
			transitionTo(e.target.id);
			
		});
		
		transitionTo("mappanel");
		 $('[data-toggle="tooltip"]').tooltip()
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
						}, 500, function() {
							$(el).hide();
						});
					
					
					};
				});
				
				
				//$( panel ).css({"z-index": "5000"});
				$( panel ).css({"opacity": 0});
				$( panel ).show();
				
				  $( panel ).animate({
					opacity: 1,
				  }, 500, function() {
					
				//	$( ".controlpanel" ).each(function( index, el ) {
				//		if ( "#" + el.id != panel ) { $(el).hide(); } ;
				//	});
				  });
				
		//	}
	
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
