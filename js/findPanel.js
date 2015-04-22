define(function () {

    function findPanel(div, app, lp) {

    	//mapheight = $( window ).height() - $( "#header" ).height() - $( "#footer" ).height();
    this.app = app;
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

    this.MAP.on('move', $.proxy(function(e) {

        // set map coords

        c = this.MAP.getCenter();
        //console.log(c);
        this.app.curlatlon = [c.lng, c.lat];
        //this.app.lp._refresh();

    }), this);

    }

    findPanel.prototype = {

    	constructor: findPanel,

      resize: function() {

        totw = $(  "#" + this.div).width();

        topheight = $( "#findheader" ).outerHeight(true);

        fullheight = $( "#" + this.div ).outerHeight(true) - 17;

        $( "#findmap" ).css({"height": (fullheight - topheight) + "px"});

        $( "#crosshairs" ).css({"left": (totw / 2) - 10 + "px"});
        $( "#crosshairs" ).css({"top":(fullheight / 2) + "px"});

        L.Util.requestAnimFrame(this.MAP.invalidateSize, this.MAP, false, this.MAP._container);

        this.layer.redraw();

      },

      _focus: function() {

        //console.log(this.app.curlatlon)
        try {
          this.MAP.setView([this.app.curlatlon[1],this.app.curlatlon[0]], 15);
        } catch(e) {

          // no location just stay in center of world
        }
        //L.Util.requestAnimFrame(this.MAP.invalidateSize, this.MAP, false, this.MAP._container);

      }


    };

    return findPanel;
});
