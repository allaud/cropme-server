CORE("lynch", {
  require: []
}, function(CORE){

  var lynch = {
    options: {
      height: "30px",
      width: "100px",
      opacity: "0.8",
      "font-size": "12px",
      background: "#F7F4DD",
      position: "absolute"
    },
    image_options: {
      opacity: "0.8",
      position: "absolute"
    },
    init: function(){
      this._init_events();
    },
    precreate: function(event, contour, image){
      this.image = !!image;
      this.contour = contour ? $(contour) : $("<div>Изменить текст</div>");
      this.contour.css(image ? this.image_options : this.options);
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
          var signal = self.image ? "image:new" : "block:new";
          CORE.trigger(signal, [null, event.pageX, event.pageY, self.contour]);
          self.contour.remove();
        }
      });
    }
  }

  lynch.init();
  
  return lynch;
});


