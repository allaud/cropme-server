CORE("widgets.mobile", {
  require: []
}, function(CORE){
  CORE.bind("dom:ready", function(){
    $("input").change(function(){
      $("#upload").submit();
    });

    $(".btn-primary").click(function(){
      var self = this;
      $(this).find("span").text("ОТКРЫВАЕМ..");

      _.delay(function(){
        $(self).find("span").text("ВЫБРАТЬ");
      }, 1000);
    });
    
  });
});