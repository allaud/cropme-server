CORE("widgets.download", {
  require: ["utils.os"]
}, function(CORE){

  var retina = (window.devicePixelRatio > 1) ? 'r' : '';

  var os = CORE.utils.os.name() + retina;

  var explain = {
    '': '',
    'osx': {
      text: "CropMe.app для OS X (3 mb)",
      link: "/downloads/CropMe.zip",
      selector: "[href='#macinstall']"
    },
    'osxr': {
      text: "CropMe.app Retina для OS X (3 mb)",
      link: "/downloads/CropMeR.zip",
      selector: "[href='#macinstall']"
    },
    'win': {
      text: "Setup.exe для Windows, 5 mb",
      link: "/downloads/cropme-setup.exe",
      selector: "[href='#windowsinstall']"
    },
    'nix': {
      text: "Bash-скрипт для Linux, 1 kb",
      link: "#linuxinstall",
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
