
define(function () {
	
    function userPanel(div, app) {
  
        if (!(this instanceof userPanel)) {
            throw new TypeError("userPanel constructor cannot be called as a function.");
        }

		this.div = $(div);

		
    }
 


 
    userPanel.prototype = {

    	constructor: userPanel
     
		
    };
	
    return userPanel;
});

	