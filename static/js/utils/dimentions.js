CORE("utils.dimentions", {
  require: []
}, function(CORE){
  return {
    get: function(src, handler){
      var width, height;
      $("<img/>").attr("src", src).load(function() {
          width = this.width;
          height = this.height;
          handler(width, height);
      });
    }
  };
});