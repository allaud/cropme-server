CORE("dem.text", {
  require: []
}, function(CORE){

  var TextBlock = function(paper, options){
    this.options = _.extend({}, this._default_options, options);
    this.text = paper.text(this.options.x, this.options.y, this.options.text);
    this.text.attr(this.options.view);

    this._editable(this.text);
    this._position();
  };
  TextBlock.prototype = {
    _default_options: {
      wrapper: "#paper",
      text: "Текстовая строка",
      editable: true,
      x: 0,
      y: 0,
      view: {},
      textarea_extender: 20,
      position: function(text){
        text.transform("...T0,0");
      }
    },
    _font_attrs: ["font-size", "font-family"],
    _editable: function(){
      if(!this.options.editable){
        return;
      }
      var self = this;
      this.text.click(function(event){
        var text_block = this;
        var overlay = self._create_overlay(text_block);

        overlay.textarea.focus().select();
        overlay.textarea.on("keyup", function(){
          var text = overlay.textarea.val();
          text_block.attr("text", text + ".");
          self._position();
          overlay.textarea.css(self._get_textarea_attrs());
        }).on("blur", function(){
            var text = overlay.textarea.val();
            text_block.attr("text", text);
            if(!text_block.attr("text")){
              text_block.attr("text", self.options.text);
            }
            overlay.textarea.remove();
            overlay.overlay.remove();
            self._position();
        });

      });      
    },
    _blur: function(){
      return this.options.blur();
    },    
    _position: function(){
      return this.options.position(this.text);
    },
    _create_overlay: function(text_block){
      var edit_text = text_block.attr('text');
      var font_attrs = this._get_font_attrs();
      var textarea_attrs = this._get_textarea_attrs();
      var attrs = _.extend({}, font_attrs, textarea_attrs);

      var overlay = $("<div></div>");
      overlay.css({
        "top": 0,
        "position": "absolute",
        "height": "100%",
        "width": "100%"
      });
      overlay.appendTo("body");

      var textarea = $("<textarea></textarea>");
      textarea.css(attrs).text(edit_text).appendTo("body");

      return {
        overlay: overlay,
        textarea: textarea
      };
    },
    _get_box: function(){
      var box = this.text.getBBox();
      var abs = {
        x: box.x + $(this.options.wrapper).offset().left,
        y: box.y + $(this.options.wrapper).offset().top,
        width: box.width,
        height: box.height
      };
      return abs;
    },
    _get_font_attrs: function(){
      return this.text.attr(this._font_attrs);
    },
    _get_textarea_attrs: function(){
      var box = this._get_box();
      return {
        position: "absolute",
        top: box.y,
        left: box.x,
        width: box.width + this.options.textarea_extender,
        height: box.height,
        "line-height": this.options.view["font-size"] + "px",
        resize: "none",
        background: "#ccc"
      };
    }
  };
  
  return {
    create: function(paper, options){
      return new TextBlock(paper, options);
    }
  };
});


