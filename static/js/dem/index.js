CORE("dem", {
  require: ["pencil", "dem.options", "dem.text", "dem.position"]
}, function(CORE){

  var dem = {
    add: function(){
      this.init();
      this._text();
      this.add = function(){
        this.init();
      };
    },
    init: function(){
      this._resize_paper();
      this._resize_image();
      CORE.dem.position.center(CORE.pencil.set, CORE.pencil.bg, {
        y: "same"
      });
      CORE.pencil.overlay.transform("...s1.05,1.05");
      CORE.trigger("dem:switch");
    },
    remove: function(){
      var size = this._get_dimentions();
      this._resize_paper(size);
      CORE.pencil.set.transform("");
      CORE.trigger("dem:switch");
    },
    _text: function(){
      var image = CORE.pencil.set.getBBox();
      var text_margin = parseInt(CORE.dem.options.top_text["font-size"] / 2)

      this.slogan = CORE.dem.text.create(CORE.pencil.paper, {
        text: "Кликни меня",
        textarea_extender: 40,
        view: CORE.dem.options.top_text,
        position: function(text){
          CORE.dem.position.center(text, CORE.pencil.bg, {
            y: image.height + image.y + text_margin,
            command: "T"
          });
        }
      });

      this.tagline = CORE.dem.text.create(CORE.pencil.paper, {
        text: "аналогично",
        view: CORE.dem.options.bottom_text,
        position: function(text){
          CORE.dem.position.center(text, CORE.pencil.bg, {
            y: image.height + image.y + 50 + text_margin,
            command: "T"
          });
        }
      });

    },
    _resize_image: function(){
      var size = this._get_dimentions();
      var image_width = CORE.dem.options.image.width;
      var image_height = CORE.dem.options.image.height;
      var resized = this._resize(size.width, size.height, image_width, image_height);
      CORE.pencil.set.transform("s" + resized.scale + "," + resized.scale + ",0,0");
    },
    _paper_extender: function(resized){
      var coef = resized.width / resized.height;
      if(coef>1){
        return parseInt(15 * coef);
      };
      return 0;
    },
    _resize_paper: function(resized){
      if(!resized){
        var size = this._get_dimentions();
        var paper_width = CORE.dem.options.paper.width;
        var paper_height = CORE.dem.options.paper.height;
        var resized = this._resize(size.width, size.height, paper_width, paper_height);

        resized.height += this._paper_extender(resized);
        resized.height += CORE.dem.options.text_height;
      }
      $("#paper").width(resized.width);
      $("#paper").height(resized.height);
      CORE.pencil.bg.attr({
        height: resized.height,
        width: resized.width
      });
      CORE.pencil.paper.setSize(resized.width, resized.height);
    },
    _resize: function(width, height, width2, height2){
      var bigger = (width > width2 || height > height2);
      var smaller = (width < width2 || height < height2);
      scale = 1;
      if (bigger || smaller){
        var vscale = height / height2;
        var hscale = width / width2;
        var scale = 1 / Math.max(vscale, hscale);
        var width = parseInt(width * scale);
        var height = parseInt(height * scale);
      }
      return {
        width: width,
        height: height,
        scale: scale
      }
    },
    _get_dimentions: function(){
      this._dimentions = {
        width: $('#paper').width(),
        height: $('#paper').height()
      };
      this._get_dimentions = function(){
        return this._dimentions;
      };
      return this._get_dimentions();
    }
  }
  
  return dem;
});


