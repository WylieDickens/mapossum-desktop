
define(function () {
	
    function createQuestionPanel(div, app) {
  
        if (!(this instanceof createQuestionPanel)) {
            throw new TypeError("createQuestionPanel constructor cannot be called as a function.");
        }

		this.div = $(div);

		
    }
 


 
    createQuestionPanel.prototype = {

    	constructor: createQuestionPanel
     
		
    };
	
    return createQuestionPanel;
});

	