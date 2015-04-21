
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
		
		this.showLogin();
		

		$("body").append(this.panel);
		
		// do this for logins
		//app.user = -1;
		//app.loggedIn = 1;
		
		// if app.user == undefined then open login model.
		
		this.panel.find(".loginButton").bind( "click", $.proxy( this.attemptLogin, this ) )
		this.panel.find(".GosignupButton").bind( "click", $.proxy( this.showSignup, this ) )
		this.panel.find(".GologinButton").bind( "click", $.proxy( this.showLogin, this ) )
		this.panel.find(".signinButton").bind( "click", $.proxy( this.attemptSignUp, this ) )
		

		this.panel.find("input").bind("click",function() {$(this).removeClass( "redinvalid" )})
		
    }
 
 
    loginModel.prototype = {

    	constructor: loginModel,
		
		show: function() {
		
		  this.panel.modal('show');	
		
		},

		attemptSignUp: function() {
		
			username = this.panel.find("#txtUsername")[0].value;
			password = this.panel.find("#txtPassword")[0].value;
			password2 = this.panel.find("#txtPassword2")[0].value;
			fname = this.panel.find("#txtFirstName")[0].value;
			lname = this.panel.find("#txtLastName")[0].value;
			aff = this.panel.find("#txtAffiliation")[0].value;
			
			if (password != password2) {
			
				alert("Passwords Don't Match")
			
			} else {
			
				$.getJSON("http://services.mapossum.org/adduser", {"email":username,"password":password, "affiliation": aff, "first": fname, "last": lname}, $.proxy(this.processSignUp, this));
		
			}
		
			//$.getJSON("http://services.mapossum.org/verify", {"email":username,"password":password}, $.proxy(this.processVerify, this));
		
		},
		
		processSignUp: function(data) {
		
			console.log(data);

			this.processVerify(data);			
		
		},
		
		attemptLogin: function() {
		
			username = this.panel.find("#txtUsername")[0].value;
			password = this.panel.find("#txtPassword")[0].value;
		
			$.getJSON("http://services.mapossum.org/verify", {"email":username,"password":password}, $.proxy(this.processVerify, this));
		
		},
		
		processVerify: function(data) {
		
			console.log(data.userid);
			if (data.userid == -1) {
			
				this.panel.find("#txtUsername").addClass( "redinvalid" );
				this.panel.find("#txtPassword").addClass( "redinvalid" );
			
			} else {
			
				this.processLogin(data);
				refpanel = this.app.previousPanel.pop()
				transitionTo(refpanel);
				this.app.up.updateUser();
			
			}
		
		},
		
		processLogin: function(data) {
		
			console.log(data);
			localStorage.userID = data.userid;
			this.app.loggedIn = data.userid;
			this.panel.modal('hide');
		
		},
		
		showSignup: function() {

			this.panel.find(".login").hide();
			this.panel.find(".signup").show();
		
		},
		
		showLogin: function() {

			this.panel.find(".login").show();
			this.panel.find(".signup").hide();
		
		}
     
		
    };
	
    return loginModel;
});

	