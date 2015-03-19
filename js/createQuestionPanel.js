
//define("createQuestionPanel", ["text!some/module.html"], function (html) {

define("createQuestionPanel", function () {
	
    function createQuestionPanel(div, app) {
  
        if (!(this instanceof createQuestionPanel)) {
            throw new TypeError("createQuestionPanel constructor cannot be called as a function.");
        }

		this.div = $("#" + div);

		
    }
 


 
    createQuestionPanel.prototype = {

    	constructor: createQuestionPanel,
		
		submitQuestion: function() {
		
			console.log(this.div);
		
		}
     
		
    };
	
    return createQuestionPanel;
});

	