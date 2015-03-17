
define(function () {
	
    function answerPanel(id, app) {
    	
        if (!(this instanceof answerPanel)) {
            throw new TypeError("answerPanel constructor cannot be called as a function.");
        }
        
		this.app = app;
		this.div = $("#" + id);
		this.div.empty();
		this.mainDiv = $('<div class="row"></div>');
		this.div.append(this.mainDiv);
		
		this.answerDiv = $('<div class="answerMain col-md-8"></div>');
		this.mainDiv.append(this.answerDiv);
		
		this.answerSpace = $('<div></div>');
		this.answerDiv.append(this.answerSpace)
		
		this.submit = $(' <button type="submit" class="btn btn-default" id="subAnswer">Submit</button>')
		this.answerDiv.append(this.submit)
		
		this.locationDiv = $('<div id="answerLocation" class="col-md-4"><h4>You current answer location will be located at or near:<h4></div>');
		this.mainDiv.append(this.locationDiv);

		this.changeLocation = $(' <div class="buttonLoc"><button type="submit" class="btn btn-default" id="updateLoc">Update Your Submission Location</button></div>')
		this.mainDiv.append(this.changeLocation)
		//this.div.append(this.locationMap);
		
		$(this.submit).bind('click', function(){		
			answerPanel.pushAnswer(app, $('input[name=ansRadio]:checked').val() )
		});
		
    }
 
	answerPanel.makeRadio = function(answer) {			
		radioDiv = $('<input type="radio" name="ansRadio" class="answerRadio" value="'+answer.answerid+'"/>' + answer.answer + '<br>');
		return radioDiv
	}
	
	answerPanel.pushAnswer = function(app, answerid){

			loc = app.curlatlon;
			qid = app.questions[app.curIndex].qid;
		
			$.getJSON( "http://services.mapossum.org/addresponse?qid=" + qid + "&answerid=" + answerid + "&location=" + loc + "&callback=?", function( data ) {  
				  d = new Date();
				  v = d.getTime();    	
			      app.mapossumLayer.options.v = v;
				  app.mapossumLayer.redraw();
			    });
		}
 
    answerPanel.prototype = {

    	constructor: answerPanel,
     
		gotoQuestion: function(qid) {

			apdiv = this.answerSpace;
			apdiv.empty();

			titleDiv = $('<h4 class="answerTitle">' + this.app.questions[this.app.curIndex].question + '</h4>');
			apdiv.append(titleDiv);
			
			explainDiv = $('<h5 class="explainText">' + this.app.questions[this.app.curIndex].explain + '</h5>');
			apdiv.append(explainDiv);
			
			$.getJSON("http://services.mapossum.org/getanswers?qid=" + qid + "&callback=?", function(data) {
				$.each(data.data, function( index, value ) {
					if(value.answer != null){
						apdiv.append(answerPanel.makeRadio(value));
					}				
				})
			
			});			
			
		}

    };

    return answerPanel;
});