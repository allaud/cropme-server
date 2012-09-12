CORE("pencil.controls", {
  require: ["pencil"]
}, function(CORE){

  var controls = {
    init: function(){
      this.panel = $('.navbar');
      this._init_events();
    },
    set_pencil: function(layout){
      CORE.pencil.params["stroke-width"] = 1;
      $(layout).parents('.nav').find('.active').removeClass('active');
      $(layout).addClass('active');
    },
    set_color: function(color, layout){
      CORE.pencil.params.stroke = color;
      $(layout).parents('.dropdown').find('.colored').css('border-color', color);
      $(layout).parents('.open').removeClass('open');
    },
    set_stroke: function(width, layout){
      CORE.pencil.params["stroke-width"] = parseInt(width);
      $(layout).parents('.open').removeClass('open');
      $(layout).parents('.nav').find('.active').removeClass('active');
      $(layout).parents('li').addClass('active');
    },
    revert: function(){
      var last = CORE.pencil.actions.pop();
      if(last){
        last.remove();
      }
    },
    _save: function(){
      var canvas = $('#canvas')[0];
      var paper = $('#paper');
      var self = this;

      panel.find(".ajax").show();
      canvg(canvas, svgfix(paper.html()), {
        renderCallback: function(){
          var imgage_b64 = canvas.toDataURL("image/png"),
            raw_b64_image = imgage_b64.replace('data:image/png;base64,', '');
          $.post('/upload', {'image': raw_b64_image}, function(data){
            if(data === 'error'){
              self.panel.find(".ajax").hide();
              alert('Произошла ошибка!');
              return;
            }
            document.location.href = data;
          })      
        }
      });
    },
    _init_events: function(){
      var self = this;
      this.panel.find('.colorpicker li').on('click', function(){
        var color = $(this).attr('style').replace('background:', '');
        self.set_color(color, this);
      });  
      this.panel.find('.width-selector li').on('click', function(){
        var width = $(this).find('div').css('height');
        self.set_stroke(width, this);
      });
      this.panel.find('.pencil').on('click', function(){
        self.set_pencil(this);
      });
      this.panel.find('.revert').on('click', function(){
        self.revert();
      });
      this.panel.find('.btn-primary').on('click', function(){
        self._save();
      });
    }
  }

  CORE.bind("dom:ready", function(){
    controls.init();
  });

});


