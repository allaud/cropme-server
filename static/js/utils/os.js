M("utils.os", function(CORE){
  var os = "unknown";

  var name = function(){
    var version = navigator.appVersion;
    if(version.indexOf("Win")!=-1){
      os = "win";
      return os;
    }
    if(version.indexOf("Mac")!=-1){
      os = "osx";
      return os;
    }
    if(version.indexOf("X11")!=-1 || version.indexOf("Linux")!=-1){
      os = "nix";
      return os;
    }
    return os;
  }

  return {
    name: name
  }
});