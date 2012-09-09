CORE("pencil.controls", {
  require: ["pencil"]
}, function(CORE){

  CORE.bind("dom:ready", function(){
    var panel = $('.navbar');

    panel.find('.btn-primary').on('click', function(){
      var canvas = $('#canvas')[0];
      panel.find(".ajax").show();
      canvg(canvas, svgfix($('#paper').html()), {
        renderCallback: function(){
          var imgage_b64 = canvas.toDataURL("image/png"),
            raw_b64_image = imgage_b64.replace('data:image/png;base64,', '');
          $.post('/upload', {'image': raw_b64_image}, function(data){
            if(data === 'error'){
              panel.find(".ajax").hide();
              alert('Произошла ошибка!');
              return;
            }
            document.location.href = data;
          })      
        }
      });
    });

    panel.find('.colorpicker li').on('click', function(){
      var color = $(this).attr('style').replace('background:', '');
      CORE.pencil.params.stroke = color;
      $(this).parents('.dropdown').find('.colored').css('border-color', color);
      $(this).parents('.open').removeClass('open');
    });

    panel.find('.width-selector li').on('click', function(){
      var width = $(this).find('div').css('height');
      CORE.pencil.params["stroke-width"] = parseInt(width);
      $(this).parents('.open').removeClass('open');
      $(this).parents('.nav').find('.active').removeClass('active');
      $(this).parents('li').addClass('active');
    });

    panel.find('.pencil').on('click', function(){
      CORE.pencil.params["stroke-width"] = 1;
      $(this).parents('.nav').find('.active').removeClass('active');
      $(this).addClass('active');
    });

    panel.find('.revert').on('click', function(){
      var last = CORE.pencil.actions.pop();
      if(last){
        last.remove();
      }
    });

  });

});


