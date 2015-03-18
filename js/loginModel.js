
define(function () {
	
    function loginModel(div, app) {
  
        if (!(this instanceof loginModel)) {
            throw new TypeError("loginModel constructor cannot be called as a function.");
        }

		this.div = $(div);

		this.app = app
		
		app.user = -1;
		
		// if app.user == undefined then open login model.
		
    }
 


 
    loginModel.prototype = {

    	constructor: loginModel,
     
		
    };
	
    return loginModel;
});

	