
define("loginModel", 
	[
		"text!templates/loginPanel.html",
		"injectCSS"
	], function (
		html,
		injectCSS
	) {
	
    function loginModel(app) {
  
        if (!(this instanceof loginModel)) {
            throw new TypeError("loginModel constructor cannot be called as a function.");
        }

		//this.div = $(div);

		this.app = app
		
		this.panel = $(html)
		
		
		
		$("body").append(this.panel);
		
		// do this for logins
		//app.user = -1;
		//app.loggedIn = 1;
		
		// if app.user == undefined then open login model.
		
		this.panel.find(".loginButton").bind( "click", $.proxy( this.attemptLogin, this ) )
		this.panel.find(".signupButton").bind( "click", $.proxy( this.showSignup, this ) )
		
    }
 
 
    loginModel.prototype = {

    	constructor: loginModel,
		
		show: function() {
		
			this.panel.modal('show')
		
		},
		
		attemptLogin: function() {

			alert("LOGIN");
		
		},
		
		showSignup: function() {

			this.panel.find(".login").hide();
			this.panel.find(".signup").show();
		
		}
     
		
    };
	
    return loginModel;
});

	