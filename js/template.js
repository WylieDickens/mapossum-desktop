
define(function () {
	
    function template(div, app) {
  
        if (!(this instanceof template)) {
            throw new TypeError("template constructor cannot be called as a function.");
        }

		this.div = $(div);

		
    }
 


 
    template.prototype = {

    	constructor: template
     
		
    };
	
    return template;
});

	