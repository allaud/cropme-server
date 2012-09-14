CORE("pencil.dem", {
  require: ["pencil"]
}, function(CORE){

  var dem = {
    options: {
      paper: {
        width: 600,
        height: 600
      },
      image: {
        width: 450,
        height: 450        
      },
      text_height: 100,
      top_text: {
        "font-size": 20,
        fill: "#fff"
      }
    },
    add: function(){
      this._resize_paper();
      this._resize_image();
      this._center_image();
      this._text();
    },
    remove: function(){
      var size = this._get_dimentions();
      this._resize_paper(size);
      CORE.pencil.set.transform("");
    },
    _resize_image: function(){
      var size = this._get_dimentions();
      var image_width = this.options.image.width;
      var image_height = this.options.image.height;
      var resized = this._resize(size.width, size.height, image_width, image_height);
      CORE.pencil.set.transform("s" + resized.scale + "," + resized.scale + ",0,0");
    },
    _center_image: function(){
      var image_box = CORE.pencil.set.getBBox();
      var shift = {
        x: parseInt((CORE.pencil.paper.width - image_box.width) / 2),
        y: parseInt(((CORE.pencil.paper.height - this.options.text_height) - image_box.height) / 2),
      };
      CORE.pencil.set.transform("...T" + shift.x + "," + shift.y);      
    },
    _resize_paper: function(resized){
      if(!resized){
        var size = this._get_dimentions();
        var paper_width = this.options.paper.width;
        var paper_height = this.options.paper.height;
        var resized = this._resize(size.width, size.height, paper_width, paper_height);
        resized.height += this.options.text_height;
      }
      $("#paper").width(resized.width);
      $("#paper").height(resized.height);
      CORE.pencil.bg.attr({
        height: resized.height,
        width: resized.width
      });
      CORE.pencil.paper.setSize(resized.width, resized.height);
    },
    _text: function(){
      this.text = CORE.pencil.paper.text(100, 100, "TEST STRING!");
      this.text.attr(this.options.top_text);
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


