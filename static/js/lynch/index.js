CORE("lynch", {
  require: []
}, function(CORE){

  var lynch = {
    options: {
      height: "30px",
      width: "100px",
      opacity: "0.8",
      background: "#F7F4DD",
      position: "absolute"
    },
    init: function(){
      this._init_events();
    },
    precreate: function(event){
      this.contour = $("<div>Изменить текст</div>");
      this.contour.css(this.options);
      this.contour.appendTo("body");
      this.tracking = true;
      this._track_mouse(event);
    },
    _track_mouse: function(event){
      this._rec_coords(event);
      this.contour.css({
        top: this.y,
        left: this.x
      });
    },
    _rec_coords: function(event){
      this.x = event.pageX;
      this.y = event.pageY;
    },
    _init_events: function(){
      var self = this;
      $(document).on("mousemove", function(event){
        if(!self.tracking){
          return;
        };
        self._track_mouse(event);
      });
      $(document).on("click", function(event){
        if(self.tracking){
          self.tracking = false;
          self.contour.remove();
          CORE.trigger("block:new", [event.pageX, event.pageY]);
        }
      });
    }
  }

  lynch.init();
  
  return lynch;
});


