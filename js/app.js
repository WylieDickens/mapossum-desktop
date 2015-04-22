requirejs.config({
    appDir: ".",
    baseUrl: "js",
	shim : {
        "bootstrap" : { "deps" :['jquery'] },
		"bootstrapGrid" : { "deps" :['jquery'] },
		"tinycolor": { "deps" :['jquery'] },
		"pac": { "deps" :['jquery', "bootstrap", "tinycolor"] }
    },
    paths: {
        /* Load jquery from google cdn. On fail, load local file. */
        'jquery': ['//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min', 'libs/jquery-min'],
        'leaflet': '//cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.2/leaflet' ,
		"bootstrap" :  "//maxcdn.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min",
		"bootstrapGrid" :  "//cdnjs.cloudflare.com/ajax/libs/jquery-bootgrid/1.1.4/jquery.bootgrid",
//		"Chart": "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/1.0.2/Chart",
		"pac": "pick-a-color-1.2.3.min",
		"tinycolor": "tinycolor"
    }
});

define([
		'jquery',
		'leaflet',
		'bootstrap',
		"bootstrapGrid",
		"tinycolor",
		"pac",
		"answerPanel",
		"loginModel",
		"createQuestionPanel",
	//	"Chart",
		"moCharts",
		"findPanel",
		"userPanel",
		'goog!visualization,1,packages:[corechart,geochart]'
		],
		function(
		$,
		L,
		bs,
		bg,
		tc,
		pac,
		answerPanel,
		loginModel,
		createQuestionPanel,
	//	Chart,
		moCharts,
		findPanel,
		userPanel,
		goog
		) {

	var app = new Object();
	app.MAP, app.questions, app.maptype = "subs", app.curIndex, app.mapossumLayer, app.curlatlon, app.bh = [];
	app.previousPanel = new Array();
	app.loggedIn = -1;
	var questionsGrid, clicked, userAcc=[],  mapAdded = false, legendsize;

	//localStorage.removeItem("userID");

	if (localStorage.userID == undefined) {
		app.loggedIn = -1;
	} else {
		app.loggedIn = localStorage.userID;
	}

	app.ap = new answerPanel("answerpanel", app);

	app.cqp = new createQuestionPanel("addpanel", app);

	app.cp = new moCharts("chartspanel", app);

	app.fp = new findPanel("findpanel", app);

	app.loginPanel = new loginModel(app);

	app.up = new userPanel("userpanel", app);

	$("#logbutton").on("click", function() {

	// add code to update login button

		if (app.loggedIn == -1) {

			app.loginPanel.show();

		} else {

			app.loggedIn = -1;
			localStorage.removeItem("userID");
		}

	})

    setup = function() {

		doLayout();
		app.MAP = L.map('mappanel', {trackResize:true, maxZoom:18}).setView([0,0], 2);

		var bwlayer = L.tileLayer(
					'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
					//attribution: '&copy; Mapossum',
					maxZoom: 18,
					})

		app.MAP.addLayer(bwlayer);

		$($('.maptypeDD')[0]).find("a").on('click', function (el) {
			app.maptype = $(el.target).data("maptype")
			changemapType(app.maptype)
		})

		app.MAP.on('move', function(e) {
		    buildHash();
		});


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

	function getParameterByName(name) {
		name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
		var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
			results = regex.exec(location.search);
		return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	}

		questionsGrid = $("#grid-data").bootgrid({
			ajax: true,
			caseSensitive: false,
			rowCount: [10, 25, 50],
			requestHandler: function (request) {
						 //See if hash Exists
						qids = getParameterByName('qids');
						console.log(qids);
						qid = ""
						if ((window.location.hash != "") && (mapAdded == false)) {
							hashes = window.location.hash.replace("#","").split("|");
							qid = hashes[0];
							request.qids = qid;
							request.returnCurrent = true;
						}
						if (qids != "") {
							if (qid != "") {qid = qid + ","}
						    request.qids = qid + qids;
							request.logic = "and";
							request.hidden = true;
						}
				request.count = request.rowCount;
				return(request);
			},
			responseHandler: function (response)
			{
				response.rows = response.data;
				//response.total = 100; //total to be done on server
				response.rowCount = response.rows.length;  //number of rows in output
				app.questions = response.data;
				app.curIndex = 0;
				hashes = window.location.hash.replace("#","").split("|");
				qid = hashes[0];
				$.each(app.questions, function( index, value ) {
					if (qid == value.qid) {
						app.curIndex = index;
					}
				});
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
					// Here we need to implement the rest of the hash (maptype and zoom location)
					hashes = window.location.hash.replace("#","").split("|");
					if (hashes.length > 1) {
						app.maptype = hashes[1];
					}

					zoom = {};
					if (hashes.length > 2) {
						zoom.center = [hashes[3], hashes[4]];
						zoom.level = hashes[2];
					}

					gotoquestion(app.questions[app.curIndex], zoom);
					/* Executes after data is loaded and rendered */
					questionsGrid.find(".command-map").on("click", function(e)
					{
						cqid = $(this).data("row-id")
						$.each(app.questions, function( index, value ) {
							if(value.qid == cqid){
								app.curIndex = index
								gotoquestion(value)
								transitionTo('mapbutton')
								return
							}
						});

					}).end().find(".command-chart").on("click", function(e)
					{
						app.cp.fetchdata($(this).data("row-id"));
            transitionTo("chartsbutton");
            cqid = $(this).data("row-id")
						$.each(app.questions, function( index, value ) {
							if(value.qid == cqid){
								app.curIndex = index
								gotoquestion(value)
								return
							}
            });
					}).end().find(".command-download").on("click", function(e)
					{
						link = document.createElement("a")
						link.href = "http://services.mapossum.org/download/" + $(this).data("row-id") + ".csv"
						link.click()
						$('#downloadModal').modal('show');
					});
				});

    }

	$(document).keydown(function(a) {
		if (a.which == 39) {
			nextQuestion();
		}
		if (a.which == 37) {
			previousQuestion();
		}
		if (a.which == 13) {
			transitionTo('answerbutton');
			if($('input[name=ansRadio]:checked').val() > 0){
				$(ap.submit).trigger( "click" )
			}
		}
	} )

	$( window ).resize(function() {
		doLayout();
	});

	nextQuestion = function(){
			app.curIndex += 1
			if(app.curIndex == 10){
				pbut = $($(".next a")[0]);
				pbut.trigger("click");
				return
			}
			else{
				gotoquestion(app.questions[app.curIndex])
			}
			disableButtons();
		}

	previousQuestion = function(){
		app.curIndex -= 1
		if(app.curIndex == -1){
			$($(".prev a")[0]).trigger("click");
			return
		}
		else{
			gotoquestion(app.questions[app.curIndex])
		}

		disableButtons();
	}

	$("#nextQuestion").bind('click', nextQuestion);
	$("#previousQuestion").bind('click', previousQuestion);

	isFinal = function(buttonClass){
			pbut = $($("." + buttonClass + " a")[0]);
			pbutDaddy = pbut.parent()[0];
			return (pbutDaddy.className.indexOf("disabled") > -1);
	}

	disableButtons = function() {

			if (isFinal("prev") && (app.curIndex == 0)) {
				$("#previousQuestion").css({"opacity": 0.08})
			} else {
				$("#previousQuestion").css({"opacity": 0.6})
			}
			if (isFinal("next") && (app.curIndex == app.questions.length-1)) {
				$("#nextQuestion").css({"opacity": 0.08})
			} else {
				$("#nextQuestion").css({"opacity": 0.6})
			}

	}


	gotoquestion = function(row, zoom){

	if (zoom == undefined) {zoom = {}};
		if(mapAdded == false){
			d = new Date();
			iv = d.getTime();
			app.mapossumLayer = L.tileLayer('http://maps.mapossum.org/{qid}/{maptype}/{z}/{x}/{y}.png?v={v}', {maptype: app.maptype, qid:app.questions[app.curIndex].qid, v: iv, opacity: 0.7})
			app.mapossumLayer.addTo(app.MAP);
			mapAdded = true;
		}
		else{
			changeQuestion(app.questions[app.curIndex].qid);
      app.cp.fetchdata(app.questions[app.curIndex].qid)
		}
		$("#maptitle").html( '<center>' + row.question + '</center>' );
		$("#maptitle").css('font-size', "30px");
		$("#maptitle").autoSizr();

		disableButtons();

		highlightCurrentRow();
		getLegend(app.questions[app.curIndex].qid);
		app.ap.gotoQuestion(app.questions[app.curIndex].qid);

		if (zoom.center == undefined) {
			getExtent(app.questions[app.curIndex].qid)
		} 	else {
		    app.MAP.setView(zoom.center, zoom.level)
		}

	}

	getExtent = function(qid){
		$.getJSON( "http://services.mapossum.org/getextent/"+ qid + "/" + app.maptype + "?callback=?", function( data ) {
	 		minExtent = data[0];
	 		maxExtent = data[1];
	 		bounds = [minExtent, maxExtent];
	 		fitBounds(bounds)
	 	});
	}

	fitBounds = function(bounds){
		app.MAP.fitBounds(bounds, {padding:0});
	}

	changemapType = function(newMapType) {
		app.maptype = newMapType
	 	app.mapossumLayer.options.maptype = newMapType
	 	app.mapossumLayer.redraw();
	 	//buildHash();
		c = app.MAP.getCenter();
		app.MAP.panTo([c.lat +0.1,c.lng]);
		c = app.MAP.getCenter();
		app.MAP.panTo([c.lat -0.1,c.lng]);
	}

	changeQuestion = function(qid) {
		app.mapossumLayer.options.qid = qid
		app.mapossumLayer.redraw();
		//buildHash();
	}

	getLegend = function(qid){
		d = new Date();
		iv = d.getTime();
		$("#maplegend").empty();
		legendImage = $('<img src="http://services.mapossum.org/legend/' +qid+'?v='+ iv + '&opacity=0&color=black" width="' + legendsize + '">')
		legendImage.appendTo('#maplegend').trigger( "create" )
	}

	buildHash = function() {
			app.bh = [];
			c = app.MAP.getCenter();
			app.bh.push(app.questions[app.curIndex].qid);
			app.bh.push(app.maptype);
			app.bh.push(app.MAP.getZoom())
			app.bh.push(c.lat);
			app.bh.push(c.lng);
			window.location.hash = app.bh.join("|")
	}

	highlightCurrentRow = function(un) {

		questionsGrid.find('tr').each(function( index, el ) {
			$(el).css({"background": ""})
		});


		if (un == undefined) {
			cgridrow = questionsGrid.find('[data-row-id=' + app.curIndex + ']')[0]
			$(cgridrow).css({"background": "#ADCAE2"})
		}
	}


	/* function to change divs */
	transitionTo = function(buttonClicked) {
		app.previousPanel.push(buttonClicked);

    if (buttonClicked == "answerbutton") {

      app.lp._refresh();

    }

		if((buttonClicked == "userbutton" || buttonClicked == "addbutton") && app.loggedIn == -1){
			clicked = buttonClicked;
			app.loginPanel.show();
			//$('#loginModal').modal('show')
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
					$(el).css("z-index", -1)
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
		$( panel ).css("z-index", 400)

		$( panel ).animate({
			opacity: 1,
		}, 400, function() {

		});

		}
	}

	/* layout the page on a resize */
	doLayout = function() {
		mapwidth = $( window ).width() - $( "#control" ).width(); //- 5;
		mapheight = $( window ).height() - $( "#header" ).height() - $( "#footer" ).height();
		titleWidth = mapwidth - $( "#nextQuestion" ).width() - $( "#previousQuestion" ).width() - 20;  // this last number has to be total of the margins and padding for each element in the footing area is.
		legendsize = mapwidth/8

		if(app.questions != undefined){
			getLegend(app.questions[app.curIndex].qid)
		}

		$( "#mainpanel" ).css({"width": mapwidth + "px"});
		$( "#mainpanel" ).css({"height": mapheight + "px"});
		$( "#control" ).css({"height": mapheight + "px"});
		$( "#maptitle" ).css({"width": titleWidth + "px"});

		app.cp.resize();
    app.fp.resize();

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

	$( document ).ready( setup )

    return {};

});
