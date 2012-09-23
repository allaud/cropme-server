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
      text: "Изменить текст",
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
        width: 110,
        cursor: "move",
        fill: "#F7F4DD",
        stroke: "#F7F4DD"
      },
      text: {
        font: "Arial",
        cursor: "text",
        "font-size": 12,
        'text-anchor': 'start',
        fill: "#000"
      },
      spirit_tentacle: {
        fill: "#888",
        "fill-opacity": 0.5,
        "stroke": "#F7F4DD",
        "stroke-width": 10
      },
      tentacle: {
        fill: "#F7F4DD",
        stroke: "#F7F4DD"
      },
      glow: {
        color: "#999",
        width: 10
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
      this.glow.remove();
      console.log("glow");
      //console.log(this.text.text);
      //console.log(this.text.text.getBBox().width, this.text.text.getBBox().height);
      console.log(this.text.text.getBBox().width, this.text.text.getBBox().height);
      console.log(this.rect.getBBox().width, this.rect.getBBox().height);

      var self = this;
      _.delay(function(){
        self._glow();
      }, 10);
      
    },
    _glow: function(){
      this.glow = this.rect.glow(this.options.glow);
      this.set.push(this.glow); 
    },
    _group: function(){
      this.set = CORE.pencil.paper.set();
      this.set.push(this.rect);
      this.set.push(this.text.text);
      this._glow();
    },
    _draggable: function(){
      var self = this;
      var start = function () {
        this.odx = 0;
        this.ody = 0;
        self.set.animate({"fill-opacity": 0.8}, 500);
      },
      move = function (dx, dy) {
        var x = dx - this.odx;
        var y = dy - this.ody;
        self.set.transform("...T" + x + "," + y);
        this.odx = dx;
        this.ody = dy;
      },
      up = function () {
          self.set.animate({"fill-opacity": 1}, 500);
      };
      this.set.drag(move, start, up);
    },
    _draw_tentacle: function(x, y, sx, sy, tentacle, attrs){
      var base = this._round_basement(x, y, sx, sy);
      var path = {
        start: [base.x1, base.y1],
        top: [0,0],
        end: [base.x2, base.y2]
      };
      tentacle.attr(_.extend({}, this.options.tentacle, attrs));
      path.top = [x, y];
      var tpath = "M" + path.start.join(",");
      tpath += "L" + path.top.join(",");
      tpath += "L" + path.end.join(",");
      tpath += "L" + path.start.join(",");
      tentacle.attr("path", tpath);
      this.rect.toFront();
      this.text.text.toFront();
    },
    _round_basement: function(x, y, sx, sy){
      var wid = 10;
      var tg = (y - sy) / (x - sx);
      var rad = Math.atan(1/tg);

      return {
        x1: sx - wid * Math.cos(rad),
        y1: sy + wid * Math.sin(rad),
        x2: sx + wid * Math.cos(rad),
        y2: sy - wid * Math.sin(rad)
      }
    },
    _get_center: function(){
      var origin_box = this.rect.getBBox();
      return {
        sx: origin_box.x + parseInt(origin_box.width/2),
        sy: origin_box.y + parseInt(origin_box.height/2)
      }
    },
    _init_tentacle_events: function(tentacle, glow){
      var self = this;
      tentacle.hover(function(){
        self.tentacle.hide();
        this.attr({
          fill: "#f00"
        });
      });
      tentacle.mouseout(function(){
        this.attr({
          fill: self.options.tentacle.fill
        });
      });
      tentacle.click(function(){
        this.remove();
        glow.remove();
      });      
    },
    _init_events: function(){
      var self = this;
      this.rect.hover(function(){
        self.tentacle.hide();
      });

      CORE.pencil.overlay.mousemove(function(event){
        var offset = $("#paper").offset();
        var x = event.clientX - offset.left;
        var y = event.clientY - offset.top;
        var box = _.clone(self.rect.getBBox());
        var cling = 30;

        box.x = box.x - cling;
        box.y = box.y - cling;
        box.x2 = box.x2 + cling;
        box.y2 = box.y2 + cling;

        if(Raphael.isPointInsideBBox(box, x, y)){
          var center = self._get_center();
          self.tentacle.show();
          self._draw_tentacle(x, y, center.sx, center.sy, self.tentacle, self.options.spirit_tentacle);
        } else {
          self.tentacle.hide();
        }
      });

      var start = function () {
        this.tentacle = CORE.pencil.paper.path();
        
      },
      move = function (dx, dy, x, y) {
        var offset = $("#paper").offset();
        x = x - offset.left;
        y = y - offset.top;
        var center = self._get_center();
        self._draw_tentacle(x, y, center.sx, center.sy, this.tentacle);
      },
      up = function () {
        var glow = this.tentacle.glow(self.options.glow);
        self.set.push(this.tentacle);
        self.set.push(glow);
        self._init_tentacle_events(this.tentacle, glow);

      };
      this.tentacle.drag(move, start, up);
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


