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
					console.log($(el.target).data("charttype"))
					this.type = $(el.target).data("charttype")
					this.updatechart($(el.target).data("charttype"))
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
					newcanvas = $('<canvas style="width:100%;height:400px;"></canvas>');
					this.mainDiv.append(newcanvas);

					this.canvas = newcanvas[0];

					if(type == "Bar"){
						newChart = Object()
						newChart["labels"] = new Array()
						newChart["datasets"] = new Array()
						answercount = new Array();

						dataout = new Array();
						$.each(this.data, $.proxy(function( index, value ) {
								if(value.answer != null){
									newChart["labels"].push(value.answer)
									answercount.push(value.count)
								}
						}, this))

						newChart["datasets"].push({"data":answercount});
						var ctx = this.canvas.getContext("2d");
						myChart = new Chart(ctx).Bar(newChart);
					}
					else if(type == "Pie"){

						pieData = new Array()

						$.each(this.data, $.proxy(function( index, value ) {
								if(value.answer != null){
										crtAtr = {value:value.count, color:value.color, highlight:value.color, label:value.answer}
										pieData.push(crtAtr)
								}
						}, this))
						console.log(newChart)
						var ctx = this.canvas.getContext("2d");
						myChart = new Chart(ctx).Pie(pieData);

					}
				}


    };

    return moCharts;
});
