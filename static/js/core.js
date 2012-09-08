var CORE = (function(){
  var modules = {};
  var events = {};

  var signals = {
    bind: function(name, handler){
      if(!events[name]){
        events[name] = [];
      }
      events[name].push(handler);
    },
    trigger: function(name, params){
      if(!events[name]){
        return;
      }
      _.each(events[name], function(handler){
        handler.apply(null, params);
      });
    }
  };

  var init_paths = function(sandbox){
    var append = function(sandbox, paths, data){
      if(paths.length < 1){
        _.extend(sandbox, data);
        return sandbox;
      }
      var path = paths.shift();
      if(!sandbox[path]){
        sandbox[path] = {};
      }
      return append(sandbox[path], paths, data);
    };

    _.each(sandbox, function(elem, key){
      var paths = key.split('.');
      append(sandbox, paths, elem);
      delete sandbox[key];
    });
  };

  var init_module = function(name, module, sandbox){
    _.extend(sandbox, signals);
    modules[name] = module(sandbox);
    signals.trigger(name + ":ready"); 
  };

  var create_sandbox = function(self_name, imports, module){
    var local_sandbox = {};
    var try_send_ready = function(){
      if(imports.require.length === _.keys(local_sandbox).length){
        init_paths(local_sandbox);
        init_module(self_name, module, local_sandbox);
      }
    };

    if(imports.require.length === 0){
      init_module(self_name, module, local_sandbox);
    }

    _.each(imports.require, function(name){
      if(modules[name]){
        local_sandbox[name] = modules[name];
        try_send_ready();
      } else {
        signals.bind(name + ":ready", function(){
          local_sandbox[name] = modules[name];
          try_send_ready();
        });
      }
    });
  };

  $(function(){
    signals.trigger("dom:ready");
  });

  return function(name, imports, module){
    var sandbox = create_sandbox(name, imports, module);
  };
}());