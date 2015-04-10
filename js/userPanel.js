define("userPanel", 
	[
		"text!templates/userPanel.html",
		"injectCSS"
	], function (
		html,
		injectCSS
	) {
	
    function userPanel(div, app) {
  
        if (!(this instanceof userPanel)) {
            throw new TypeError("userPanel constructor cannot be called as a function.");
        }

		this.div = $(div);

		//injectCSS(css);
		this.div.append($(html));
		
    }
 


 
    userPanel.prototype = {

    	constructor: userPanel
     
		
    };
	
    return userPanel;
});

	