CORE("pencil.controls", {
  require: ["pencil", "dem", "lynch"]
}, function(CORE){
  var controls = {
    dem_mode: false,
    radio: [".pencil", ".dropdown"],
    init: function(){
      this.panel = $('.navbar');
      this._init_events();
    },
    set_pencil: function(layout){
      CORE.pencil.params["stroke-width"] = 1;
      $(layout).parents('.nav').find(this.radio.join(",")).removeClass('active');
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
      $(layout).parents('.nav').find(this.radio.join(",")).removeClass('active');
      $(layout).parents('li').addClass('active');
    },
    toggle_dem: function(layout){
      $(layout).toggleClass("active");
      if(!this.dem_mode){
        CORE.dem.add();
      } else {
        CORE.dem.remove();
      };
      this.dem_mode = !this.dem_mode;
    },
    toggle_lynch: function(layout, event){
      CORE.lynch.precreate(event);
      event.stopPropagation();
    },
    toggle_troll: function(layout, event){
      var img = $(layout).clone();
      if(img.attr("data-img")){
        img.attr("src", img.attr("data-img"));
      }
      CORE.lynch.precreate(event, img, true);
      $(layout).parents('.open').removeClass('open');
      event.stopPropagation();
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

      this.panel.find(".ajax").show();
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
      this.panel.find('.dem').on('click', function(){
        self.toggle_dem(this);
      });
      this.panel.find('.lynch').on('click', function(event){
        self.toggle_lynch(this, event);
      });
      this.panel.find('.troll img').on('click', function(event){
        self.toggle_troll(this, event);
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


