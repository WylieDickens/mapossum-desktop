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
		
		//injectCSS(css);

		//make request
		
		if (this.app.loggedIn > -1) {
		
			this.updateUser();
		
		}


    }
 
    userPanel.prototype = {

    	constructor: userPanel,
		
		updateUser: function() {
		
			this.div.empty();
			
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
		
		this.div.append($(html));
		
		this.tableBody = this.div.find("tbody");
		

		
		console.log("%%%%%%%%", data);
		
		insertRows = "";
		
		$.each(data.data, $.proxy( function(i,d) {

			nrow = "<tr><td>" + d.qid + "</td><td>" + d.question + "</td><td>" + d.created + "</td></tr>"			
			insertRows = insertRows + nrow;
			
		}, this));
		
	
		this.tableBody.append($(insertRows));
		
		app = this.app;
		
		gridder = $("#grid-user").bootgrid({
		selection: true,
		multiSelect: true,
		formatters: {
        "commands": function(column, row)
        {
			console.log(row);
            return "<button type=\"button\" class=\"btn btn-xs btn-default command-map\" data-row-question=\"" + row.question + "\" data-row-id=\"" + row.qid + "\"><span class=\"fa fa-globe\"></span></button> " +
						   "<button type=\"button\" class=\"btn btn-xs btn-default command-chart\" data-row-question=\"" + row.question + "\" data-row-id=\"" + row.qid + "\"><span class=\"fa fa-bar-chart\"></span></button>" +
						   "<button style='margin-left:4px' type=\"button\" class=\"btn btn-xs btn-default command-download\" data-row-id=\"" + row.qid + "\"><span class=\"fa fa-cloud-download\"></span></button>" 
						   //+ "<button style='margin-left:4px' type=\"button\" class=\"btn btn-xs btn-default command-delete\" data-row-id=\"" + row.qid + "\"><span class=\"fa fa-trash-o\"></span></button>";
        }
    }
	}).on("loaded.rs.jquery.bootgrid", function()
	{
		/* Executes after data is loaded and rendered */
		console.log(gridder);
		gridder.find(".command-map").on("click", function(e)
					{
						console.log(app);
						cqid = $(this).data("row-id")
						changeQuestion(cqid);
						app.cp.fetchdata(cqid)
						$("#maptitle").html( '<center>' + $(this).data("row-question") + '</center>' );
						$("#maptitle").css('font-size', "30px");
						$("#maptitle").autoSizr();


						//highlightCurrentRow(); unhilight row
						getLegend(cqid);
						app.ap.gotoQuestion(cqid);

						getExtent(cqid);
						transitionTo("mapbutton");
						
						highlightCurrentRow(true);

					}).end().find(".command-chart").on("click", function(e, b)
		{
						$("#maptitle").html( '<center>' + $(this).data("row-question") + '</center>' );
						$("#maptitle").css('font-size', "30px");
						$("#maptitle").autoSizr();
						app.cp.fetchdata($(this).data("row-id"));
						transitionTo("chartsbutton");
						highlightCurrentRow(true);
						
		}).end().find(".command-download").on("click", function(e)
		{
						link = document.createElement("a")
						link.href = "http://services.mapossum.org/download/" + $(this).data("row-id") + ".csv"
						link.click()
						$('#downloadModal').modal('show');
						
		}).end().find(".command-delete").on("click", function(e)
		{
			alert("You pressed delete on row: " + $(this).data("row-id"));
		});
	}); //.on("selected.rs.jquery.bootgrid", function(e, rows)
	//{
	//	console.log(rows);
	//	var rowIds = [];
	//	for (var i = 0; i < rows.length; i++)
	//	{
	//		rowIds.push(rows[i].id);
	//	}
	//	alert("Select: " + rowIds.join(","));
	//});
		
		this.grid = gridder;
		
		$('[data-toggle="tooltip"]').tooltip();
		
		$("#createSurveyBut").on("click", $.proxy(function() {
			checkers = $(this.div).find("tbody input:checked");
			
			qlist = new Array();
			$.each(checkers, function( index, cbox ) {
					qlist.push(cbox.value);
				});
				
			urlout = "http://mapossum.org?qids=" + qlist.join(",")
			$('#shareModal .modal-content').empty();
			$('#shareModal .modal-content').append("<p><b>Your survey link:</b><br><a href='" + urlout + "' target='_blank'>" + urlout + "</a></p>");
			
			$('#shareModal').modal('show');			
			//console.log("done");
		
			}, this));
		
		}
     

		
		
    };
	
    return userPanel;
});

	