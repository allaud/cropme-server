CORE("dem.position", {
  require: []
}, function(CORE){
  return {
    center: function(elem, wrapper, options){
      var elem_box = elem.getBBox();
      wrapper = wrapper.getBBox();
      var shift = {
        x: parseInt((wrapper.width - elem_box.width) / 2) + wrapper.x,
        y: parseInt(((wrapper.height - elem_box.height)) / 2) + wrapper.y,
        command: "...T"
      };
      shift = _.extend({}, shift, options || {});
      if(shift.y === "same"){
        shift.y = shift.x;
      }
      elem.transform(shift.command + shift.x + "," + shift.y);
    }
  };
});


