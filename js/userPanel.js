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

		this.app = app;
		this.div = $("#" + div);
		this.div.empty();
		//injectCSS(css);
		this.div.append($(html));
		
		gridder = $("#grid-user").bootgrid({
		selection: true,
		multiSelect: true,
		formatters: {
        "commands": function(column, row)
        {
            return "<button type=\"button\" class=\"btn btn-xs btn-default command-edit\" data-row-id=\"" + row.id + "\"><span class=\"fa fa-pencil\"></span></button> " + 
                "<button type=\"button\" class=\"btn btn-xs btn-default command-delete\" data-row-id=\"" + row.id + "\"><span class=\"fa fa-trash-o\"></span></button>";
        }
    }
}).on("loaded.rs.jquery.bootgrid", function()
{
    /* Executes after data is loaded and rendered */
	console.log(gridder);
    gridder.find(".command-edit").on("click", function(e)
    {
        alert("You pressed edit on row: " + $(this).data("row-id"));
    }).end().find(".command-delete").on("click", function(e)
    {
        alert("You pressed delete on row: " + $(this).data("row-id"));
    });
});
		
		//make request
		
		if (this.app.loggedIn > -1) {
		
			this.updateUser();
		
		}

		
    }
 


 
    userPanel.prototype = {

    	constructor: userPanel,
		
		updateUser: function() {
		
			getUsersQs = "http://services.mapossum.org/getquestions"
			
			getUQSubmit = new Object();
			getUQSubmit.users = this.app.loggedIn;
			getUQSubmit.hidden = "True";
			getUQSubmit.count = "1000000000";
			getUQSubmit.logic = "and";
			
			getUQfunction = $.proxy(this.makeGrid, this);
			$.getJSON( getUsersQs, getUQSubmit, getUQfunction);
		
		},
		
		makeGrid: function(data) {
		
		console.log("%%%%%%%%", data);
		
		}
     
		
    };
	
    return userPanel;
});

	