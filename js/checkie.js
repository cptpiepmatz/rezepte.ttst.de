function isIE() {
  ua = navigator.userAgent;
  var is_ie = ua.indexOf("MSIE ") > -1 || ua.indexOf("Trident/") > -1;
  if(is_ie) {
    console.log("This browser is not supported");
  }
  else {
    console.log("This browser is supported");
  }
  return is_ie;
}

function blockIE() {
  if(isIE()) {
    document.location.replace("nosupport.html");
  }
}

function returnForValidBrowser() {
  if(!isIE()) {
    document.location.replace("index.html");
  }
}
