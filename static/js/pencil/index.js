CORE("pencil", {
  require: []
}, function(CORE){
  var pencil_params = {
    stroke: "#ff0000",
    "stroke-width": 1
  },
    actions = [];

  var image_dimentions = function(src, handler){
    var width, height;
    $("<img/>").attr("src", src).load(function() {
        width = this.width;
        height = this.height;
        handler(width, height);
    });
  };

  var paper_offset = {};

  CORE.bind("window:resize", function(){
    paper_offset = $('#paper').offset();
  });  

  CORE.bind("dom:ready", function(){
    var target_src = $('#patient').attr('src');
    
    image_dimentions(target_src, function(width, height){
      $('#paper').css({
        width: width,
        height: height
      });
      paper_offset = $('#paper').offset();
      var paper = Raphael('paper');

      var image = paper.image(target_src, 0, 0, width, height);  
      var background = paper.rect(0, 0, width, height);
      background.attr({
        "fill": "#ccc",
        "fill-opacity": 0
      });

      var paths = [];
        
      background.drag(function(dx, dy, x, y){
        var x = x - paper_offset.left,
          y = y - paper_offset.top;
        if(0 === paths.length){
          paths.push(["M", x, y]);
          pencil_box = paper.path(paths);
          actions.push(pencil_box);
          pencil_box.attr(pencil_params);
        } else {
          paths.push(["L", x, y]);  
        }
        pencil_box.attr({path: paths});
      }, function(){
        paths = [];
      });

    });

  });

  return {
    params: pencil_params,
    actions: actions
  }
});


