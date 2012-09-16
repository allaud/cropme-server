CORE("lynch.block", {
  require: ["pencil", "dem.text", "dem.position"]
}, function(CORE){

  var Block = function(x, y, options){
    var self = this;
    this.options = _.extend({}, this._default_options, options || {});
    this.rect = CORE.pencil.paper.rect(x, y, this.width, this.height);
    this.rect.attr(this.options.rect);
    this.text = CORE.dem.text.create(CORE.pencil.paper, {
      text: "Двойной клик",
      view: this.options.text,
      position: function(text){
        CORE.dem.position.center(text, self.rect, {
          command: "T"
        });
      }
    });
  };
  Block.prototype = {
    _default_options: {
      rect: {
        height: 50,
        width: 150,
        fill: "#F7F4DD"  
      },
      text: {
        font: "Arial",
        "font-size": "12px",
        'text-anchor': 'start',
        fill: "#000"
      }
    }
  };

  CORE.bind("block:new", function(x, y){
    var layout = $("#paper");
    var offset = layout.offset();
    var box = {
      width: layout.width(),
      height: layout.height()
    };
    if (y >= offset.top && y <= offset.top + box.height && 
        x >= offset.left && x <= offset.left + box.width){
      //console.log(paper_offset);
      //console.log("CATCH", x, y);
      x = x - offset.left;
      y = y - offset.top;
      var block = new Block(x, y);
    }
  });

});


