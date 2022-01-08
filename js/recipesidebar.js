//global variables
var queryParams = new URLSearchParams(location.search);

var rawRecipeList;
var arrayRecipeList;
const recipeListUrl = "./_REZEPTE_/_Rezeptliste.php";

function getRawRecipeList() {
  //retrieves the recipe list from the server
  fetch(recipeListUrl)
    .then(function(response) {
      return response.text();
    })
    .then(function(text) {
      rawRecipeList = text;
      recipeListToArray(rawRecipeList);
    });
}

function recipeListToArray(text) {
  //splits the txt at linebreaks to array
  arrayRecipeList = text.split("\n");
  //trims spare spaces off the array
  for(i = 0; i < arrayRecipeList.length; i++) {
    arrayRecipeList[i] = arrayRecipeList[i].trim();
  }
  //removes empty elements of the array
  arrayRecipeList = arrayRecipeList.filter(function(element) {
    return element != "";
  });
  //sorts the list alphabetically
  arrayRecipeList.sort();

  generateSidebar();
}

function generateSidebar() {
  //generate the HTML code for the sidebar
  var sidebarRecipeList = "";
  var insertCurrent = "";
  arrayRecipeList.forEach(function(element) {
    //builds the HTML code and embeds it
    sidebarRecipeList += '<a href="rezept.html?rezept='
                       + element.replace(" ", "+")
                       + '"'
                       + insertCurrent
                       + '>'
                       + element
                       + '</a>';
  })
  document.getElementById("recipelist").innerHTML = sidebarRecipeList;
}

getRawRecipeList();
