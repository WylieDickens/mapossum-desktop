
define("createQuestionPanel", 
	[
		"text!templates/singleAnswer.html",
		"text!templates/createQuestionPanel.html",
		"text!templates/createQuestionPanel.css",
		"injectCSS"
	], function (
		singleAnswerText,
		html,
		css,
		injectCSS
	) {

//define("createQuestionPanel", function () {
	
    function createQuestionPanel(div, app) {
  
        if (!(this instanceof createQuestionPanel)) {
            throw new TypeError("createQuestionPanel constructor cannot be called as a function.");
        }
		
		this.defaultColors = ["00f", "008000","FF0000","FFFF00","800080", "FF8C00", "00FF00", "00FFFF", "FF00FF", "800000", "000080", "A0522D", "FF1493", "808000", "008080", "00FF7F", "DAA520", "7FFFD4", "FF7F50", "483D8B", "FFA07A", "AFEEEE", "FFE4C4"]

		this.div = $("#" + div);
		this.div.empty();
		injectCSS(css);
		this.div.append($(html));
	
		this.answerArea = this.div.find(".answerArea");
			
		this.addAnswer();
		this.addAnswer();
	
		this.addbutton = this.div.find(".addanswerbutton");
		this.addbutton.bind( "click", $.proxy( this.addAnswer, this ) )
		
		console.log("****", this.addbutton);
		
		this.messageModel = this.div.find('.message');                // initialized with defaults
		this.messageModel.modal()
		this.messageModel.modal('hide')
		
		this.submitbutton = this.div.find('.submitButton');
		
		console.log(this.submitbutton);
		
		this.submitbutton.bind( "click", $.proxy( this.prepareSubmit, this ) )
		
		this.questionText = this.div.find('[data-api="question"]');
		this.questionText.bind("click",$.proxy( function() {this.removeClass( "redinvalid" )}, this.questionText ) )
		
		this.app = app;
		
		
    }
 
 
    createQuestionPanel.prototype = {

    	constructor: createQuestionPanel,
		
		addAnswer: function() {
			//console.log(this.div);
			
			acount = (this.div.find(".answer").length)
			
			useColor = (acount) % (this.defaultColors.length)
			
			//alert('value="' + this.defaultColors[useColor] + '"')
			
			outText = singleAnswerText.replace('value="000"', 'value="' + this.defaultColors[useColor] + '"');
			answernow = $(outText);
			answernow.papa = this;
			abutton = answernow.find("button");

			atext = answernow.find(":text")
			atext.bind("click",$.proxy( function() {this.removeClass( "redinvalid" )}, atext ) )
			
			abutton.bind("click", $.proxy( function() {
							if (this.papa.div.find(".answer").length > 2) {
							this.remove(); } else { 
							//alert("You must provide at least two answers");
							this.papa.messageModel.modal('show')  
							}
							;}, answernow ));
							
			answernow.find(".pick-a-color").pickAColor({
					  showSpectrum            : true,
					  showSavedColors         : false,
					  saveColorsPerElement    : false,
					  fadeMenuToggle          : true,
					  showHexInput            : false,
					  showBasicColors         : true,
					  allowBlank              : false,
					  inlineDropdown          : false
					});
			
			this.answerArea.append(answernow);
			
			$('[data-toggle="tooltip"]').tooltip();
			
		},
		
		prepareSubmit: function() {
			
			isvalid = true;
			questionValue = this.questionText[0].value;
			if (this.questionText[0].value == "") {
				this.questionText.addClass( "redinvalid" )
				isvalid = false;
			} else {
				this.questionText.removeClass( "redinvalid" )
			}
		
			answers = this.div.find(".answer");

			answersOut = new Array();
				$.each(answers, $.proxy( function(i,a) {
					answerObj = new Object();
					clr = $(a).find('[name="color"]')[0];
					txt = $(a).find('[name="text"]')[0];
					if (txt.value == "") {
						$(txt).addClass( "redinvalid" )
						isvalid = false;
					} else {
						$(txt).removeClass( "redinvalid" )
					}
					answerObj.color = clr.value;
					answerObj.text = txt.value;
					answersOut.push(answerObj);
				}, this ) )
			
			
			explainValue = this.div.find('[data-api="explain"]')[0].value;
			hiddenValue = this.div.find('[data-api="hidden"]')[0].checked;
			
			console.log(questionValue, answersOut, explainValue, hiddenValue);
			subData = new Object();
			subData.qtext = questionValue;
			subData.answers = answersOut;
			subData.explain = explainValue;
			subData.hidden = hiddenValue;
			
			if (isvalid) {
				//alert("submit");
				//this.submitbutton.bind( "click", $.proxy( this.submitQuestion, this ) )
				this.submitQuestion(subData);
				
			} else {
				//alert("do not submit");
			}
			
		},
		
	submitQuestion: function(subData) {
	
		console.log(this, subData);
		
		
		//http://localhost:8080/addquestion?userid=-4&question=Test&hidden=true
		
		addQSubmit = new Object();
		addQSubmit.userid = this.app.loggedIn;
		addQSubmit.hidden = subData.hidden;
		addQSubmit.question = subData.qtext;
		addQSubmit.explain = subData.explain;

		addQURL = "http://services.mapossum.org/addquestion"
		
		addQfunction = $.proxy(this.submitAnswers, this, subData.answers);
		$.getJSON( addQURL, addQSubmit, addQfunction);
	
	},
	
	submitAnswers: function(answers, data) {
	
		this.submittedQuestions = 0;
		console.log(data, answers);
		addAURL = "http://services.mapossum.org/addanswer"
		addAfunction = $.proxy(function(data) {
		
					this.submittedQuestions++; console.log("aaa", data, this.submittedQuestions, answers.length)
					if (this.submittedQuestions == answers.length) {
					
						$.getJSON("http://services.mapossum.org/setupmaps", {"qid":data.qid}, function() {alert("It was all added good!")});
						//allSubmitted!
					
					}
				}, this);
		
		$.each(answers, $.proxy( function(i,a) {
	
			addASubmit = new Object();
			addASubmit.qid = data.qid;
			addASubmit.answer = a.text;
			addASubmit.color = "#" + a.color 
			$.getJSON( addAURL, addASubmit, addAfunction);
		
		}, this ));
	
	}
     
		
    };
	
    return createQuestionPanel;
});

	