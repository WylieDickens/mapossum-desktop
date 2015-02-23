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
   
	var MAP, questions, questionsGrid, loggedIn = 0, clicked, userAcc=[];
    var mpapp={userid:"", loggedUid:"",first:"", last:"", answerNum:"", qid:"", answer:"", curQuestion:"", curAnswers:"", picture:"", explain:""};
    
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
		 
		questionsGrid = $("#grid-data").bootgrid({
			ajax: true,
			caseSensitive: false,
			rowCount: [10, 25, 50],
			requestHandler: function (request) {
			
				request.count = request.rowCount;
				console.log(request);
				return(request);
			},
			responseHandler: function (response)
			{
				response.rows = response.data;
				//response.total = 100; //total to be done on server
				response.rowCount = response.rows.length;  //number of rows in output
				console.log(response);
				questions = response;
				return response;
			},
			url: "http://services.mapossum.org/getquestions",
			formatters: {
			//	"link": function(column, row)
		//		{
		//			alert('');
		//			return "<a href=\"#\">" + column.id + ": " + row.id + "</a>";
			//	},
				"commands": function(column, row)
				{

					return "<button type=\"button\" class=\"btn btn-xs btn-default command-map\" data-row-id=\"" + row.qid + "\"><span class=\"fa fa-globe\"></span></button> " + 
						   "<button type=\"button\" class=\"btn btn-xs btn-default command-chart\" data-row-id=\"" + row.qid + "\"><span class=\"fa fa-bar-chart\"></span></button>" + 
						   "<button style='margin-left:4px' type=\"button\" class=\"btn btn-xs btn-default command-download\" data-row-id=\"" + row.qid + "\"><span class=\"fa fa-cloud-download\"></span></button>";
				}
			}
		}).on("loaded.rs.jquery.bootgrid", function()
				{
					/* Executes after data is loaded and rendered */
					questionsGrid.find(".command-map").on("click", function(e)
					{
						alert("You pressed map on row: " + $(this).data("row-id"));
					}).end().find(".command-chart").on("click", function(e)
					{
						alert("You pressed chart on row: " + $(this).data("row-id"));
					}).end().find(".command-download").on("click", function(e)
					{
						alert("You pressed download on row: " + $(this).data("row-id"));
					});
				});

    }
	
	
	$( window ).resize(function() {
		doLayout();
	});
	
	setupMap = function() {
	
		console.log("#######");
		console.log(questions)
		
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
		
		// if($("#checklogin").val() = true){  //not finding checkbox for some reason
		// 	console.log(email +" in box" + password)
		// 	localStorage.setItem("semail", email)
	 //        localStorage.setItem("spassword", password)	        
		// }
	}

	/* layout the page on a resize */
	doLayout = function() {
		mapwidth = $( window ).width() - $( "#control" ).width(); //- 5;
		maphieght = $( window ).height() - $( "#header" ).height() - $( "#footer" ).height();
		$( "#mainpanel" ).css({"width": mapwidth + "px"});
		$( "#mainpanel" ).css({"height": maphieght + "px"});
		$( "#control" ).css({"height": maphieght + "px"});	
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
