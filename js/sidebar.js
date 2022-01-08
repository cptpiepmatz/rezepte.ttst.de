var windowWidth = $(window).width();

function openNav() {
  if (windowWidth > 800) {
    document.getElementById("mySidenav").style.width = "30vw";
    document.getElementById("main").style.marginLeft = "30vw";
  }
  else {
    document.getElementById("mySidenav").style.width = "100vw";
    document.getElementById("main").style.marginLeft = "100vw";
    document.getElementById("main").style.padding = "0px";
  }
};
function closeNav() {
  document.getElementById("mySidenav").style.width = "0px";
  document.getElementById("main").style.marginLeft = "0px";
  document.getElementById("main").style.padding = "";
};
