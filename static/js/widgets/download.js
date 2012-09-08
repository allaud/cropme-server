CORE("widgets.download", {
  require: ["utils.os"]
}, function(CORE){
  var os = CORE.utils.os.name();
  var explain = {
    '': '',
    'osx': {
      text: "Cropme.app application for OS X, 7 mb",
      link: "/download/Cropme.app"
    },
    'win': {
      text: "Cropme.exe installer for Windows, 5 mb",
      link: "/download/Setup.exe"
    },
    'nix': {
      text: "Shell script for Linux, 1 kb",
      link: "/bashscript"
    }
  }

  CORE.bind("dom:ready", function(){
    var content = $(".content");

    content.find(".explain").text(explain[os].text);
    content.find(".btn-download").attr("href", explain[os].link);
  });
});