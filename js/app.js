requirejs.config({
    appDir: ".",
    baseUrl: "js",
	shim : {
      //  "bootstrap" : { "deps" :['jquery'] }
    },
    paths: { 
        /* Load jquery from google cdn. On fail, load local file. */
        'jquery': ['//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min', 'libs/jquery-min'],
        'leaflet': '//cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.2/leaflet' //,
//		"bootstrap" :  "//netdna.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min"  
    }
});

define(['jquery', 'leaflet'], function($, L, bs) {
    
	
  	console.log("loaded");
   
    setup = function() {
   
		doLayout();
		
		
		var map = L.map('map', {trackResize:true, maxZoom:18}).setView([31.328920, -89.333514], 10);
		
		
		var bwlayer = L.tileLayer(
					'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
					//attribution: '&copy; Mapossum',
					maxZoom: 18,
					})
		
		map.addLayer(bwlayer);

    }
  
    $( document ).ready( setup )
	
	
	$( window ).resize(function() {
		doLayout();
	});
	
	
	doLayout = function() {
		mapwidth = $( window ).width() - $( "#control" ).width();
		maphieght = $( window ).height() - $( "#header" ).height()- $( "#footer" ).height();
		$( "#map" ).css({"width": mapwidth + "px"});
		$( "#map" ).css({"height": maphieght + "px"});
		$( "#control" ).css({"height": maphieght + "px"});	
	};
     
      
    return {};
    
});
