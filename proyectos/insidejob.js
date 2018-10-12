function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function filtme(){
  var param = getParameterByName("where");
  if(param !== null){
    $("BODY").children().hide();
    $("BODY").children("#" + param).show();
    switch (param) {
      case "mps":
      case "minuteearth":
        loadProjects(param);
        break;
      default:
    }
  }
}
