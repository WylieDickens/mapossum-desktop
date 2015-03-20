
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

	
    }
 


 
    createQuestionPanel.prototype = {

    	constructor: createQuestionPanel,
		
		addAnswer: function() {
			//console.log(this.div);
			answernow = $(singleAnswerText);
			answernow.papa = this;
			abutton = answernow.find("button");
			abutton.bind("click", $.proxy( function() {
							if (this.papa.div.find(".answer").length > 2) {
							this.remove(); } else { 
							//alert("You must provide at least two answers");
							this.papa.messageModel.modal('show')  
							}
							;}, answernow ));
							
							
			this.answerArea.append(answernow);
			
		}
     
		
    };
	
    return createQuestionPanel;
});

	