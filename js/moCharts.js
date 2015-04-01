
define(function () {
	
    function moCharts(div, app) {
  
        if (!(this instanceof moCharts)) {
            throw new TypeError("moCharts constructor cannot be called as a function.");
        }
        this.app = app;
		this.div = $(div);
		
    }
 
    moCharts.buildchart = function(data){ 
        $.each(data, $.proxy(function( index, value ) {
            //if(value.answer != null){
                               
                crtAtr = {value:data[index].count, color:data[index].color, highlight:data[index].color, label:data[index].answer}
                this.app.chartdata.push(crtAtr)
            //}               
        }, this))

        var ctx = document.getElementById('chartspanel').getContext("2d");
        myPie = new Chart(ctx).Pie(charts);

        transitionTo("chartsbutton");
    }

 
    moCharts.prototype = {

    	constructor: moCharts,

        fetchdata: function(qid){            
            
            $.proxy($.getJSON( "http://services.mapossum.org/getanswers?qid=" + qid + "&callback=?", function( data ) {
              moCharts.buildchart(data.data)
            }), this);
        }
     
		
    };
	
    return moCharts;
});

	