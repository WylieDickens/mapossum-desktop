
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
		
		this.submitbutton.bind( "click", $.proxy( this.submitQuestion, this ) )
		
		this.questionText = this.div.find('[data-api="question"]');
		this.questionText.bind("click",$.proxy( function() {this.removeClass( "redinvalid" )}, this.questionText ) )
		
		
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
		
		submitQuestion: function() {
			
			isvalid = true;
			questionValue = this.questionText[0].value;
			if (this.questionText[0].value == "") {
				this.questionText.addClass( "redinvalid" )
				isvalid = false;
			} else {
				this.questionText.removeClass( "redinvalid" )
			}
		
			answers = this.div.find(".answer").find(":text");

			answersText = new Array();
				$.each(answers, $.proxy( function(i,a) {
					if (a.value == "") {
						$(a).addClass( "redinvalid" )
						isvalid = false;
					} else {
						$(a).removeClass( "redinvalid" )
					}
					answersText.push(a.value);
				}, this ) )
			
			
			this.explainValue = this.div.find('[data-api="explain"]')[0].value;
			this.hiddenValue = this.div.find('[data-api="hidden"]')[0].checked;
			
			console.log(questionValue, answersText, this.explainValue, this.hiddenValue);
			
			if (isvalid) {
				alert("submit");
			} else {
				alert("do not submit");
			}
			
		}
     
		
    };
	
    return createQuestionPanel;
});

	