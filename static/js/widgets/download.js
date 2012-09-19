CORE("widgets.download", {
  require: ["utils.os"]
}, function(CORE){
  var os = CORE.utils.os.name();
  var explain = {
    '': '',
    'osx': {
      text: "CropMe.app для OS X (3 mb)",
      link: "/downloads/CropMe.zip",
      selector: "[href='#macinstall']"
    },
    'win': {
      text: "Setup.exe для Windows, 5 mb",
      link: "/downloads/cropme-setup.exe",
      selector: "[href='#windowsinstall']"
    },
    'nix': {
      text: "Bash-скрипт для Linux, 1 kb",
      link: "#install",
      selector: "[href='#linuxinstall']"
    }
  };

  CORE.bind("dom:ready", function(){
    var content = $(".main");

    content.find(".explain").text(explain[os].text);
    content.find(".btn-download").attr("href", explain[os].link);
    $(explain[os].selector).tab('show');
  });
});