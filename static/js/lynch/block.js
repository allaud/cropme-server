CORE("lynch.block", {
  require: ["pencil", "dem.text", "dem.position"]
}, function(CORE){

  var Block = function(x, y, options){
    var self = this;
    this.options = _.extend({}, this._default_options, options || {});
    this.tentacle = CORE.pencil.paper.path("M0,0");
    this.rect = CORE.pencil.paper.rect(x, y, this.width, this.height);
    this.rect.attr(this.options.rect);
    this.text = CORE.dem.text.create(CORE.pencil.paper, {
      text: "Двойной клик",
      view: this.options.text,
      textarea_extender: 5,
      position: function(text){
        var box = self.rect.getBBox();
        var x = box.x + 10;
        var y = box.y + parseInt(text.getBBox().height / 2) + 5;
        text.transform("T" + x + "," + y);
        self._autosize();
      }
    });
    this._default_text_box = this.text.text.getBBox();
    this._group();
    this._draggable();
    this._init_events();
  };
  Block.prototype = {
    _default_options: {
      rect: {
        height: 30,
        width: 100,
        cursor: "move",
        fill: "#F7F4DD",
        stroke: "#E0D9A3"
      },
      text: {
        font: "Arial",
        cursor: "text",
        "font-size": 12,
        'text-anchor': 'start',
        fill: "#000"
      }
    },
    _autosize: function(){
      if(!this.text){
        return;
      }
      var box = this.text.text.getBBox();
      var dx = box.width - this._default_text_box.width;
      var dy = box.height - this._default_text_box.height;
      var current = this.rect.attr(["width", "height"]);
      this.rect.attr({
        "width": this.options.rect.width + dx,
        "height": this.options.rect.height + dy
      });
    },
    _group: function(){
      this.set = CORE.pencil.paper.set();
      this.set.push(this.rect);
      this.set.push(this.text.text);
    },
    _draggable: function(){
      var self = this;
      var start = function () {
        this.odx = 0;
        this.ody = 0;
        this.animate({"fill-opacity": 0.8}, 500);
      },
      move = function (dx, dy) {
        var x = dx - this.odx;
        var y = dy - this.ody;
        self.rect.transform("...T" + x + "," + y);
        self.text.text.transform("...t" + x + "," + y);
        this.odx = dx;
        this.ody = dy;
      },
      up = function () {
          this.animate({"fill-opacity": 1}, 500);
      };
      this.rect.drag(move, start, up);
    },
    _init_events: function(){
      var self = this;
      CORE.pencil.overlay.mousemove(function(event){
        var offset = $("#paper").offset();
        var x = event.clientX - offset.left;
        var y = event.clientY - offset.top;
        var origin_box = self.rect.getBBox();
        var box = _.clone(origin_box);
        var cling = 30;

        box.x = box.x - cling;
        box.y = box.y - cling;
        box.x2 = box.x2 + cling;
        box.y2 = box.y2 + cling;

        var sx = origin_box.x + parseInt(origin_box.width/2);
        var sy = origin_box.y + parseInt(origin_box.height/2);

        var path = {
          start: [sx, sy],
          top: [0,0],
          end: [sx + 10, sy + 10]
        }

        if(Raphael.isPointInsideBBox(box, x, y)){
          self.tentacle.show();
          self.tentacle.attr({
            fill: "#f00"
          });
          path.top = [x, y];
          var tpath = "M" + path.start.join(",");
          tpath += "L" + path.top.join(",");
          tpath += "L" + path.end.join(",");
          tpath += "L" + path.start.join(",");
          //console.log(111);
          self.tentacle.attr("path", tpath);

        } else {
          self.tentacle.hide();
        }
      });
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
      x = x - offset.left;
      y = y - offset.top;
      var block = new Block(x, y);
    }
  });

});


