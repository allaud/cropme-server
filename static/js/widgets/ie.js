CORE("widgets.ie", {
  require: []
}, function(CORE){
  CORE.bind("dom:ready", function(){
    if ($.browser.msie){
      $(".alert").show();

      $(".alert").find(".close").on("click", function(){
        $(this).parent().hide();
      });
    }
  });
});