define(function () {

    function moCharts(div, app) {

        if (!(this instanceof moCharts)) {
            throw new TypeError("moCharts constructor cannot be called as a function.");
        }

        this.app = app;
				this.div = $("#" + div);
				this.data = new Array();
				this.type = "Bar"

		    $($('.charttypeDD')[0]).find("a").on('click', $.proxy(function (el) {
					//console.log($(el.target).data("charttype"))
					this.type = $(el.target).data("charttype")
					this.updatechart($(el.target).data("charttype"))
				}, this))

			mybutt = $('<button style="position:absolute;top:3px;right:3px;z-index:30" type="button" data-toggle="tooltip" data-placement="left" title="" data-original-title="Close the Charts"><span class="fa fa-times"></span> </button>');
			this.div.append(mybutt);
			
			mybutt.on('click', $.proxy(function (el) {
				transitionTo(this.app.previousPanel[this.app.previousPanel.length-2]);
				this.mainDiv.empty();
			}, this))
			
				this.mainDiv = $('<div></div>');
				this.div.append(this.mainDiv);

				

			
    }

    moCharts.prototype = {

    	constructor: moCharts,

        fetchdata: function(qid){

            $.getJSON( "http://services.mapossum.org/getanswers?qid=" + qid + "&callback=?", $.proxy(function( data ) {
							this.data = data.data
							
							this.updatechart(this.type)
            },this));
        },

				updatechart: function(type){
					
					this.mainDiv.empty();
					
					newcanvas = $('<div style="width:100%;height:500px;position:absolute;left:0px;top:0px"></div>');
					this.mainDiv.append(newcanvas);
					this.canvas = newcanvas[0];
					
					dataout = new Array();
					sly = new Object();
					x = 0;
					dataout.push(['Value', 'Count', { role: 'style' }])
					$.each(this.data, $.proxy(function( index, value ) {
							if(value.answer != null){
								dataout.push([value.answer, value.count, value.color]);
								sly[x] = {color: value.color};
								x = x + 1;
							}
					}, this))						

					this.currentdata = google.visualization.arrayToDataTable(dataout);
					
					//console.log(sly);
					
					if(type == "Bar"){
					

						 this.options = {
						  hAxis: {title: 'Responses',  titleTextStyle: {color: '#333'}},
						  vAxis: {minValue: 0},
						  backgroundColor: { fill:'transparent' },
						  legend: { position: "none" },
						  bar: {groupWidth: "95%"}
						};
						
						this.chart = new google.visualization.BarChart(this.canvas);
						//this.chart.draw(this.currentdata, this.options);
		
		
					}
					else if(type == "Pie"){

						this.options = {
						  hAxis: {title: 'Count',  titleTextStyle: {color: '#333'}},
						  vAxis: {minValue: 0},
						  backgroundColor: { fill:'transparent' },
						  slices: sly
						};
						
						this.chart = new google.visualization.PieChart(this.canvas);
						//this.chart.draw(this.currentdata, this.options);
						
					}
					this.resize();
				},
				
				resize: function(){

				ht = $( "#mainpanel" ).height();
				
			 try {
				$(this.canvas).css({"height": ht + "px"});	

				this.chart.draw(this.currentdata, this.options);
				
			 } catch(e) {
				 
			 }
	
				
				}


    };

    return moCharts;
});
