CORE("macro", {
  require: ["pencil", "macro.options"]
}, function(CORE){

  var macro = {
    add: function(){
      this._resize_paper();
      this._resize_image();
      this._center(CORE.pencil.set);
      this._text();
    },
    remove: function(){
      var size = this._get_dimentions();
      this._resize_paper(size);
      CORE.pencil.set.transform("");
    },
    _text: function(){
      this.text = CORE.pencil.paper.text(0, 0, "можно просто так взять");
      this.text.attr(CORE.macro.options.top_text);
      this._editable(this.text);
      this._text_coord(this.text);

      this.bottom_text = CORE.pencil.paper.text(0, 0, "и сделать макро");
      this.bottom_text.attr(CORE.macro.options.bottom_text);
      this._text_coord(this.bottom_text, CORE.macro.options.bottom_text_margin);
    },
    _editable: function(text){
      var superself = this;
      text.click(function(event){
        var box = this.getBBox();
        var self = this;
        var abs = {
          x: box.x + $("#paper").offset().left,
          y: box.y + $("#paper").offset().top,
        }
        var edit_text = this.attr('text');
        var font_attrs = this.attr([
          "font-size",
          "font-family"
        ]);
        var textarea_attrs = {
          position: "absolute",
          top: abs.y,
          left: abs.x,
          width: box.width,
          height: box.height,
          background: "#ccc",
          overflow: "hidden"
        };

        var attrs = _.extend({}, font_attrs, textarea_attrs);
        var textarea = $("<textarea></textarea>");
        var contour = $("<span></span>");
        contour.css(font_attrs).text(edit_text).appendTo("body");

        textarea.css(attrs).text(edit_text).appendTo("body");
        textarea.on("keyup", function(){
          var text = textarea.val();
          contour.text();
          textarea.css({
            "width": contour.width() + 10,
            "height": contour.height()
          });
        }).on("blur", function(){
          var text = textarea.val();
          textarea.remove();
          contour.remove();
          self.attr({
            "text": text
          });
        });
      });
    },
    _text_coord: function(text, shift){
      shift = shift || 0;
      var text_shift = parseInt(CORE.macro.options.top_text["font-size"]);
      var image = CORE.pencil.set.getBBox();
      this._center(text, {
        y: image.height + image.y + text_shift + shift
      });
    },
    _resize_image: function(){
      var size = this._get_dimentions();
      var image_width = CORE.macro.options.image.width;
      var image_height = CORE.macro.options.image.height;
      var resized = this._resize(size.width, size.height, image_width, image_height);
      CORE.pencil.set.transform("s" + resized.scale + "," + resized.scale + ",0,0");
    },
    _resize_paper: function(resized){
      if(!resized){
        var size = this._get_dimentions();
        var paper_width = CORE.macro.options.paper.width;
        var paper_height = CORE.macro.options.paper.height;
        var resized = this._resize(size.width, size.height, paper_width, paper_height);

        resized.height += CORE.macro.options.text_height;
      }
      $("#paper").width(resized.width);
      $("#paper").height(resized.height);
      CORE.pencil.bg.attr({
        height: resized.height,
        width: resized.width
      });
      CORE.pencil.paper.setSize(resized.width, resized.height);
    },
    _center: function(elem, options){
      var elem_box = elem.getBBox();
      var shift = {
        x: parseInt((CORE.pencil.paper.width - elem_box.width) / 2),
        y: parseInt(((CORE.pencil.paper.height - CORE.macro.options.text_height) - elem_box.height) / 2),
      };
      var shift = _.extend({}, shift, options || {});

      elem.transform("...T" + shift.x + "," + shift.y);      
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
  
  return macro;
});


