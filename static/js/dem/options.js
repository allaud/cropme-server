CORE("dem.options", {
  require: []
}, function(CORE){

    return {
      paper: {
        width: 600,
        height: 600
      },
      image: {
        width: 450,
        height: 450        
      },
      text_height: 100,
      bottom_text_margin: 50,
      top_text: {
        "font-size": 58,
        fill: "#fff",
        cursor: "text",
        'text-anchor': 'start',
        "font-family": "Georgia, 'Times New Roman', Times, serif"
      },
      bottom_text: {
        "font-size": 16,
        fill: "#fff",
        cursor: "text",
        'text-anchor': 'start',
        "font-family": "'Lucida Grande', Tahoma, Verdana, Arial, sans-serif"
      }      
  };

});


