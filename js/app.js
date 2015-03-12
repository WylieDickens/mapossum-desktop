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
		"bootstrapGrid" :  "//cdnjs.cloudflare.com/ajax/libs/jquery-bootgrid/1.1.4/jquery.bootgrid"	
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
   
	var MAP, questions, questionsGrid, loggedIn = 0, clicked, userAcc=[], mapType = "subs", curIndex, mapossumLayer, mapAdded = false, maptype = "subs", legendsize;
    
    setup = function() {
   
		doLayout();
		
		MAP = L.map('mappanel', {trackResize:true, maxZoom:18}).setView([0,0], 2);
		
		var bwlayer = L.tileLayer(
					'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
					//attribution: '&copy; Mapossum',
					maxZoom: 18,
					})
		
		MAP.addLayer(bwlayer);

		$($('.maptypeDD')[0]).find("a").on('click', function (el) {
			console.log(el.target)
			maptype = $(el.target).data("maptype")
			changemapType(maptype)
		})
  

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
		 
		questionsGrid = $("#grid-data").bootgrid({
			ajax: true,
			caseSensitive: false,
			rowCount: [10, 25, 50],
			requestHandler: function (request) {				
				request.count = request.rowCount;
				return(request);
			},
			responseHandler: function (response)
			{
				response.rows = response.data;
				//response.total = 100; //total to be done on server
				response.rowCount = response.rows.length;  //number of rows in output
				questions = response.data;
				console.log(questions)
				curIndex = 0;			
				return response;
			},
			url: "http://services.mapossum.org/getquestions",
			formatters: {
				"commands": function(column, row)
				{

					return "<button type=\"button\" class=\"btn btn-xs btn-default command-map\" data-row-id=\"" + row.qid + "\"><span class=\"fa fa-globe\"></span></button> " + 
						   "<button type=\"button\" class=\"btn btn-xs btn-default command-chart\" data-row-id=\"" + row.qid + "\"><span class=\"fa fa-bar-chart\"></span></button>" + 
						   "<button style='margin-left:4px' type=\"button\" class=\"btn btn-xs btn-default command-download\" data-row-id=\"" + row.qid + "\"><span class=\"fa fa-cloud-download\"></span></button>";
				}
			}
		}).on("loaded.rs.jquery.bootgrid", function()
				{						
					gotoquestion(questions[curIndex]);
					/* Executes after data is loaded and rendered */
					questionsGrid.find(".command-map").on("click", function(e)
					{	
						cqid = $(this).data("row-id")
						$.each(questions, function( index, value ) {												
							if(value.qid == cqid){
								curIndex = index
								gotoquestion(value)
								transitionTo('mapbutton')
								return
							}
						});
						
					}).end().find(".command-chart").on("click", function(e)
					{
						alert("You pressed chart on row: " + $(this).data("row-id"));
					}).end().find(".command-download").on("click", function(e)
					{						
						link = document.createElement("a")
						link.href = "http://services.mapossum.org/download/" + $(this).data("row-id") + ".csv"					
						link.click()
						$('#downloadModal').modal('show'); 	
					});
				});

    }
	
	
	$( window ).resize(function() {
		doLayout();
	});

	$("#nextQuestion").bind('click', function(){		
		curIndex += 1
		console.log(curIndex)
		if(curIndex == 10){
			pbut = $($(".next a")[0]);
			pbut.trigger("click");
			return
		}
		else{
			gotoquestion(questions[curIndex])
		}		
		disableButtons();
	});
	
	isFinal = function(buttonClass){
			pbut = $($("." + buttonClass + " a")[0]);
			pbutDaddy = pbut.parent()[0];
			return (pbutDaddy.className.indexOf("disabled") > -1);
	}
	
	disableButtons = function() {

			if (isFinal("prev") && (curIndex == 0)) {
				$("#previousQuestion").css({"opacity": 0.08})
			} else {
				$("#previousQuestion").css({"opacity": 0.6})
			}
			console.log(curIndex, questions.length)
			if (isFinal("next") && (curIndex == questions.length-1)) {
				$("#nextQuestion").css({"opacity": 0.08})
			} else {
				$("#nextQuestion").css({"opacity": 0.6})
			}
	
	}

	$("#previousQuestion").bind('click', function(){		
		curIndex -= 1
		console.log(curIndex)
		if(curIndex == -1){		
			$($(".prev a")[0]).trigger("click");
			return
		}
		else{
			gotoquestion(questions[curIndex])
		}	
		
		disableButtons();
	});


	gotoquestion = function(row, zoom){
		if(mapAdded == false){						
			d = new Date();
			iv = d.getTime();		 
			mapossumLayer = L.tileLayer('http://maps.mapossum.org/{qid}/{maptype}/{z}/{x}/{y}.png?v={v}', {maptype: maptype, qid:questions[curIndex].qid, v: iv, opacity: 0.7})
			mapossumLayer.addTo(MAP);
			mapAdded = true;						
		}
		else{			
			changeQuestion(questions[curIndex].qid);
		}	
		$("#maptitle").html( '<center>' + row.question + '</center>' );
		$("#maptitle").css('font-size', "30px");
		$("#maptitle").autoSizr();
		
		disableButtons();
		
		highlightCurrentRow();
		getLegend(questions[curIndex].qid)

		if (zoom == undefined) {
			getExtent(questions[curIndex].qid)
		} 	
		
	}

	getExtent = function(qid){	
		$.getJSON( "http://services.mapossum.org/getextent/"+ qid + "/" + maptype + "?callback=?", function( data ) {      	
	 		minExtent = data[0]; 		
	 		maxExtent = data[1];
	 		bounds = [minExtent, maxExtent];  			
	 		fitBounds(bounds)
	 	});
	}

	fitBounds = function(bounds){	
		MAP.fitBounds(bounds, {padding:0});
	}

	changemapType = function(newMapType) {
		maptype = newMapType
	 	mapossumLayer.options.maptype = newMapType
	 	mapossumLayer.redraw();
	 	//updateHash();
	}

	changeQuestion = function(qid) {	    
		mapossumLayer.options.qid = qid
		mapossumLayer.redraw();
		//updateHash();
	}

	getLegend = function(qid){
		console.log('here' + qid)
		d = new Date();
		iv = d.getTime(); 		
		$("#maplegend").empty();			    	
		legendImage = $('<img src="http://services.mapossum.org/legend/' +qid+'?v='+ iv + '&opacity=0&color=black" width="' + legendsize + '">')
		legendImage.appendTo('#maplegend').trigger( "create" )
	}

	
	highlightCurrentRow = function() {
		
		questionsGrid.find('tr').each(function( index, el ) {
			$(el).css({"background": ""})
		});
		
		
		cgridrow = questionsGrid.find('[data-row-id=' + curIndex + ']')[0]
		console.log(cgridrow);
		$(cgridrow).css({"background": "#ADCAE2"})
		
	}
	
	
	/* function to change divs */
	transitionTo = function(buttonClicked) {
		if((buttonClicked == "userbutton" || buttonClicked == "addbutton") && loggedIn == 0){
			clicked = buttonClicked;
			$('#loginModal').modal('show')
			return
		}
	
		//$($(".next a")[0]).trigger("click");  trigger to move			
		panel = "#" + buttonClicked.replace("button","panel");
		
		if ($(panel)[0] == undefined) {
		
			
		
		
		} else {
		
		
		
		$( ".controlpanel" ).each(function( index, el ) {
			if ( "#" + el.id != panel ) { 
			
				$( el ).animate({
					opacity: 0,
				}, 400, function() {
					$(el).hide();
				});
			
			
			};
		});
		
		/* fades the divs */
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
	}

	/* verify user login information -- if successful, user questions are stored for the account page*/
	verify = function (email, password){
	    $.getJSON( "http://services.mapossum.org/verify?email=" + email + "&password=" + password + "&callback=?", function( data ) {
	      mpapp.userid = data.userid;
	      if(data.userid != -1){	        
	      	//$('#loginIcon').css( "background-color", "green" ); may use this later  	
	      	mpapp.first = data.first
	      	mpapp.last = data.last
	      	mpapp.loggedUid = data.userid	      	
	      	$.getJSON( "http://services.mapossum.org/getquestions?users=" + mpapp.loggedUid + "&minutes=0" + "&callback=?", function( userQuestions ) {
	      		info = userQuestions.data      		     	
	      		for(var i = 0; i < info.length; i++ ){ 
	      			ques = {question:info[i].question, explain:info[i].explain, uid:info[i].userid, qid:info[i].qid, hashtag:info[i].hashtag}
	      			userAcc.push(ques); 			
	      		}	      		
	      	});
	      	if(clicked === "userbutton"){
	      		loggedIn = 1;
	      		$('#loginModal').modal('hide')
	      		transitionTo("userbutton")
	      	}
	      	else if(clicked === "addbutton"){
	      		loggedIn = 1;
	      		$('#loginModal').modal('hide')
	      		transitionTo("addbutton")
	      	}
	      }
	      else{
	      	alert(data.message)
	      	$('#loginModal').modal('show')
	      }
	      
	    });
	}

	/* layout the page on a resize */
	doLayout = function() {
		mapwidth = $( window ).width() - $( "#control" ).width(); //- 5;
		maphieght = $( window ).height() - $( "#header" ).height() - $( "#footer" ).height();
		titleWidth = mapwidth - $( "#nextQuestion" ).width() - $( "#previousQuestion" ).width() - 20;  // this last number has to be total of the margins and padding for each element in the footing area is.
		legendsize = mapwidth/8
		
		if(questions != undefined){
			getLegend(questions[curIndex].qid)
		}

		$( "#mainpanel" ).css({"width": mapwidth + "px"});
		$( "#mainpanel" ).css({"height": maphieght + "px"});
		$( "#control" ).css({"height": maphieght + "px"});	
		$( "#maptitle" ).css({"width": titleWidth + "px"});
		
	};

	$.fn.autoSizr = function () {
	  var el, elements, _i, _len, _results;

	  elements = $(this);
	  if (elements.length < 0) {
	    return;
	  }
	  _results = [];
	  for (_i = 0, _len = elements.length; _i < _len; _i++) {
	    el = elements[_i];
	    _results.push((function(el) {
	      var resizeText, _results1;
	      resizeText = function() {
	        var elNewFontSize;
	        elNewFontSize = (parseInt($(el).css('font-size').slice(0, -2)) - 1) + 'px';
	        return $(el).css('font-size', elNewFontSize);
	      };
	      _results1 = [];
	      while (el.scrollHeight > el.offsetHeight) {
	        _results1.push(resizeText());
	      }
	      return _results1;
	    })(el));
	  }
	  return $(this); 
	};	

	/* login click event */
	$("#verify").bind('click', function(e) {
		email = $("#txtUsername").val()
		password = $("#txtPassword").val()  
		verify(email, password)
	});
    
 	// sem = localStorage.semail;
	// spass = localStorage.spassword;
	// console.log(sem +" "+spass)

	//  if (sem != undefined) {
	// 	verify(sem,spass)
	// }

	$( document ).ready( setup )
	
    return {};
    
});
