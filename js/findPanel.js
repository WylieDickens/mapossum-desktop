define(function () {

    function findPanel(div, app) {

    	//mapheight = $( window ).height() - $( "#header" ).height() - $( "#footer" ).height();

    	console.log($( "#findheader" ).outerHeight(true))

		$( "#findmap" ).css({"width": "100%"});
		$( "#findmap" ).css({"height": 300 + "px"});

		this.MAP = L.map('findmap', {trackResize:true, maxZoom:18}).setView([0,0], 2);

		this.layer = L.tileLayer(
					'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
					//attribution: '&copy; Mapossum',
					maxZoom: 18,
					})

		this.MAP.addLayer(this.layer);

    this.div = div;

    }

    findPanel.prototype = {

    	constructor: findPanel,

      resize: function() {

        topheight = $( "#findheader" ).outerHeight(true);

        fullheight = $( "#" + this.div ).outerHeight(true) - 17;

        $( "#findmap" ).css({"height": (fullheight - topheight) + "px"});

        L.Util.requestAnimFrame(this.MAP.invalidateSize, this.MAP, false, this.MAP._container);

        this.layer.redraw();

      }


    };

    return findPanel;
});
