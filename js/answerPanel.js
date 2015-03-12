
define(function () {

    function answerPanel(id) {

        if (!(this instanceof answerPanel)) {
            throw new TypeError("answerPanel constructor cannot be called as a function.");
        }
 
		this.div = $("#" + id);
		this.div.empty();
		this.locationDiv = $('<div class="answerLocation">Location Stuff</div>');
		this.div.append(this.locationDiv);
		
		this.mainDiv = $('<div class="answerMain"></div>');
		this.div.append(this.mainDiv);
    }
 
	answerPanel.makeRadio = function(answer) {
		console.log(answer);
		radioDiv = $('<input type="radio" name="rbtnCount" />' + answer.answer + '<br>');
		return radioDiv
	}
 
    answerPanel.prototype = {

    	constructor: answerPanel,
     
		gotoQuestion: function(qid) {
			this.mainDiv.empty();
			//this.div.append(qid);
			
			apdiv = this.mainDiv;
			
			$.getJSON("http://services.mapossum.org/getanswers?qid=" + qid + "&callback=?", function(data) {
				$.each(data.data, function( index, value ) {
					apdiv.append(answerPanel.makeRadio(value));
				})
			
			});
			//make request
			
			
			//build buttons
			
		},
	

    };

    return answerPanel;
});