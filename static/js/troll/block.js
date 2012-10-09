CORE("troll.block", {
  require: ["pencil"]
}, function(CORE){

  Block = function(x, y, src, options){
    this.set = CORE.pencil.paper.set();
    this.image = CORE.pencil.paper.image(src, x, y, options.width, options.height);
    this.set.push(this.image);
    this._create_controls(x, y, options.width, options.height);
    this._draggable();
    this._init_events();
  };
  Block.prototype = {
    _settings: {
      width: 12,
      margin: 4,
      controls: ["rotate", "resize", "mirror"],
      rotate: "/static/img/pencil/controls/rotate.png",
      resize: "/static/img/pencil/controls/resize.png",
      mirror: "/static/img/pencil/controls/mirror.png"
    },
    _create_controls: function(x, y, width, height){
      var self = this;
      var control_width = control_height = this._settings.width;
      var count = this._settings.controls.length;
      var margin = this._settings.margin;
      y = y + height - control_width;
      x = x + width - count * (control_width + margin);
      this.controls = CORE.pencil.paper.set();
      _.each(this._settings.controls, function(control){
        var src = self._settings[control];
        self[control] = CORE.pencil.paper.image(src, x, y, control_width, control_width);
        self.set.push(self[control]);
        self.controls.push(self[control]);
        x += (control_width + margin);
      });
      self.controls.hide();
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
      this.image.drag(move, start, up);
    },
    _rotatable: function(){
      var self = this;
      var start = function () {
        this.odx = 0;
        this.ody = 0;
      },
      move = function (dx, dy) {
        var x = dx - this.odx;
        var y = dy - this.ody;
        self.image.transform("...r" + y);
        this.odx = dx;
        this.ody = dy;
      },
      up = function () {
      };
      this.rotate.drag(move, start, up);
    },
    _resizable: function(){
      var self = this;
      var start = function () {
        this.odx = 0;
        this.ody = 0;
      },
      move = function (dx, dy) {
        var x = dx - this.odx;
        var y = dy - this.ody;
        var box = self.image.getBBox();
        self.image.transform("...s" + (1 + (y/10)));
        /*
        self.image.attr({
          width: box.width + x,
          height: box.height + y
        });
        */ 
        this.odx = dx;
        this.ody = dy;
      },
      up = function () {
      };
      this.resize.drag(move, start, up);
    },

    _init_events: function(){
      var self = this;
      var timeout = 0;
      this.set.mouseover(function(){
        self.controls.show();
        clearTimeout(timeout);
      });
      this.set.mouseout(function(){
        timeout = setTimeout(function(){
          self.controls.hide();  
        }, 1500);
      });
      this.mirror.click(function(){
        self.image.attr({
          transform: "...s1-1r180"
        });
      });
      this._rotatable();
      this._resizable();
    }
  };

  CORE.bind("image:new", function(x, y, image){
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

      var src = image.attr("src");
      var options = {
        width: image.width(),
        height: image.height()
      };
      var block = new Block(x, y, src, options);
    }
  });  
});