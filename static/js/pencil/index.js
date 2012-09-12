CORE("pencil", {
  require: ["utils.dimentions"]
}, function(CORE){

  var editor = {
    actions: [],
    paths: [],
    paper_offset: {},
    params: {
      stroke: "#ff0000",
      "stroke-width": 1
    },
    init: function(src){
      this.src = src;

      var self = this;
      CORE.utils.dimentions.get(src, function(width, height){
        self.width = width;
        self.height = height;
        self._init_paper();
        self._add_image();
        self._add_overlay();
      });
    },
    _init_paper: function(){
      $('#paper').css({
        width: this.width,
        height: this.height
      });
      this.paper_offset = $('#paper').offset();
      this.paper = Raphael('paper');
    },
    _add_image: function(){
      this.image = this.paper.image(this.src, 0, 0, this.width, this.height);  
    },
    _add_overlay: function(){
      this.overlay = this.paper.rect(0, 0, this.width, this.height);
      this.overlay.attr({
        "fill": "#ccc",
        "fill-opacity": 0
      });
      this._init_events();
    },
    _init_events: function(){
      var self = this;

      CORE.bind("window:resize", function(){
        self.paper_offset = $('#paper').offset();
      });  

      this.overlay.drag(function(dx, dy, x, y){
        var x = x - self.paper_offset.left,
          y = y - self.paper_offset.top;
        if(0 === self.paths.length){
          self.paths.push(["M", x, y]);
          self.pencil_box = self.paper.path(self.paths);
          self.actions.push(self.pencil_box);
          self.pencil_box.attr(self.params);
        } else {
          self.paths.push(["L", x, y]);  
        }
        self.pencil_box.attr({path: self.paths});
      }, function(){
        self.paths = [];
      });

    }
  }

  CORE.bind("dom:ready", function(){
    var target_src = $('#patient').attr('src');
    editor.init(target_src);
  });

  return editor;
});



