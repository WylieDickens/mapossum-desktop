
define("createQuestionPanel", 
	[
		"text!test.html",
	//	"text!thing/test.css"
	], function (
		html
	) {

//define("createQuestionPanel", function () {
	
    function createQuestionPanel(div, app) {
  
        if (!(this instanceof createQuestionPanel)) {
            throw new TypeError("createQuestionPanel constructor cannot be called as a function.");
        }

		this.div = $("#" + div);

		console.log(html);
		
    }
 


 
    createQuestionPanel.prototype = {

    	constructor: createQuestionPanel,
		
		submitQuestion: function() {
		
			console.log(this.div);
		
		}
     
		
    };
	
    return createQuestionPanel;
});

	