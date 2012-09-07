var pencil_box_params = {
  stroke: "#000000",
  "stroke-width": 1
},
  actions = [];

$(function(){
  var image_dimentions = function(src, handler){
    var width, height;
    $("<img/>").attr("src", src).load(function() {
        width = this.width;
        height = this.height;
        handler(width, height);
    });
  };
  
  image_dimentions("/static/test.png", function(width, height){
    $('#paper').css({
      width: width,
      height: height
    });
    var paper_offset = $('#paper').offset();
    var paper = Raphael('paper');

    var image = paper.image("/static/test.png", 0, 0, width, height);  
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
        pencil_box.attr(pencil_box_params);
      } else {
        paths.push(["L", x, y]);  
      }
      pencil_box.attr({path: paths});
    }, function(){
      paths = [];
    });

  });

});