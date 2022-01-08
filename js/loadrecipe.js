//global variables
var queryParams = new URLSearchParams(location.search);
var currentRecipe;
var recipeArray;
var recipeArrayDataPos = {
                            "pdf": {},
                            "resultimg": {},
                            "inspiration": {},
                            "ingredients": {},
                            "preparation": {}
                        };
var currentRecipePart;

if(!(queryParams.has('rezept'))) {
  document.location.replace("index.html")
}
else {
  currentRecipe = queryParams.get("rezept").replace("+", " ");
}

function noUmlauts(string) {
  return string.replace("ä", "ae")
               .replace("ö", "oe")
               .replace("ü", "ue")
               .replace("ß", "ss");
}
/////////////////////////////////////
//generate main part of recipe page//
/////////////////////////////////////

function checkAvailability() {
  if(arrayRecipeList.indexOf(currentRecipe) != -1) {
    fetchRecipe();
  }
  else {
    document.location.replace("index.html")
  }
}

function fetchRecipe() {
  fetch("./_REZEPTE_/" + currentRecipe + ".rezept.txt")
    .then(function(response) {
      return response.text();
    })
    .then(function(text) {
      recipeToArray(text.replace(/^(?!https?).*\/\/.*$/gm, "")
                        .replace(/^\s*[\r]/gm, "")
                        .replace(/\n$/, ""));
    });
}

function recipeToArray(string) {
  recipeArray = string.split("\n");
  for(i = 0; i < recipeArray.length; i++) {
    recipeArray[i] = recipeArray[i].trim();
  }
  console.log(recipeArray);
  getRecipeArrayDataPos();
}

function getRecipeArrayDataPos() {
  recipeArray.forEach(function(element, elementpos) {
    function setRecipeArrayDataPosEnd() {
      if(currentRecipePart != undefined) {
        recipeArrayDataPos[currentRecipePart].end = elementpos - 1;
        console.log("%c  Found end of %c" + currentRecipePart + "%c at %c" + recipeArrayDataPos[currentRecipePart].end, "", "font-style: italic", "", "color: blue");
      }
    }
    function setRecipeArrayDataPosIndex() {
      recipeArrayDataPos[currentRecipePart].index = elementpos + 1;
      console.log("%c  Found index of %c" + currentRecipePart + "%c at %c" + recipeArrayDataPos[currentRecipePart].index, "", "font-style: italic", "", "color: blue");
    }
    if(/^\[.*\]$/.test(element)) {
      console.log("%cRecipe-Constructor found recipe part: %c" + element.replace(/^\[(.*)\]$/, "$1"), "font-weight: bold", "");
      switch (element.replace(/^\[(.*)\]$/, "$1")) {
        case "Resultatbild":
          setRecipeArrayDataPosEnd();
          currentRecipePart = "resultimg";
          setRecipeArrayDataPosIndex();
          break;
        case "PDF":
          setRecipeArrayDataPosEnd();
          currentRecipePart = "pdf";
          setRecipeArrayDataPosIndex();
          break;
        case "Inspiration":
          setRecipeArrayDataPosEnd();
          currentRecipePart = "inspiration";
          setRecipeArrayDataPosIndex();
          break;
        case "Zutaten":
          setRecipeArrayDataPosEnd();
          currentRecipePart = "ingredients";
          setRecipeArrayDataPosIndex();
          break;
        case "Zubereitung":
          setRecipeArrayDataPosEnd();
          currentRecipePart = "preparation";
          setRecipeArrayDataPosIndex();
          break;
        default:
          console.error("Nothing in the recipe");
      }
    }
  })
  if(currentRecipePart != undefined) {
    recipeArrayDataPos[currentRecipePart].end = recipeArray.length - 1;
    console.log("%c  Found end of %c" + currentRecipePart + "%c at %c" + recipeArrayDataPos[currentRecipePart].end, "", "font-style: italic", "", "color: blue");
  }
  console.log(recipeArrayDataPos);
  constructHtmlPage();
}

function constructHtmlPage() {
  document.getElementById("recipetitle").innerHTML = currentRecipe;
  console.log("%cHTML-Constructor %cinserted recipe title", "font-weight: bold", "");

  if(recipeArrayDataPos.inspiration.index != undefined) {
    document.getElementById("inspiredby").href = recipeArray.slice(recipeArrayDataPos.inspiration.index, recipeArrayDataPos.inspiration.end + 1);
    document.getElementById("inspiredby").hidden = false;
    console.log("%cHTML-Constructor %cinserted inspiration", "font-weight: bold", "");
  }

  if(recipeArrayDataPos.pdf.index != undefined) {
    document.getElementById("printpdf").href = "_REZEPTE_/pdf/" + recipeArray.slice(recipeArrayDataPos.pdf.index, recipeArrayDataPos.pdf.end + 1);
    document.getElementById("printpdf").hidden = false;
    console.log("%cHTML-Constructor %cinserted pdf", "font-weight: bold", "");
  }

  if(recipeArrayDataPos.resultimg.index != undefined) {
    document.getElementById("resultimg").src = "_REZEPTE_/img/" + currentRecipe + "/" + recipeArray.slice(recipeArrayDataPos.resultimg.index, recipeArrayDataPos.resultimg.end + 1);
    document.getElementById("resultimg").hidden = false;
    console.log("%cHTML-Constructor %cinserted resultimg", "font-weight: bold", "");
  }

  if(recipeArrayDataPos.ingredients.index != undefined) {
    var ingredientsElements = {};
    for(i = recipeArrayDataPos.ingredients.index; i <= recipeArrayDataPos.ingredients.end; i++) {
      if(recipeArray[i].indexOf(";") != -1) {
        ingredientsElements.amount = recipeArray[i].substring(0, recipeArray[i].indexOf(";"));
        if(ingredientsElements.amount.search("/") != -1) {
          //converts fractions to number
          let amount = ingredientsElements.amount;
          let dividerPos = amount.search("/");
          ingredientsElements.amount = (parseInt(amount.substring(0, dividerPos)) / parseInt(amount.substring(dividerPos + 1))).toString();
        }
        if(ingredientsElements.amount.search(",") != -1) {
          //converts comma to dot number
          let amount = ingredientsElements.amount;
          let commaPos = amount.search(",");
          ingredientsElements.amount = Number(amount.substring(0, commaPos) + "." + amount.substring(commaPos + 1)).toString();
        }
        if(ingredientsElements.amount.search(".") != -1) {
          //redesigns the number to fractions or decimal numbers
          switch (Number(ingredientsElements.amount)) {
            case 0.5:
              ingredientsElements.amount = "½";
              break;
            case 0.25:
              ingredientsElements.amount = "¼";
              break;
            case 0.75:
              ingredientsElements.amount = "¾";
              break;
            default:
              ingredientsElements.amount = ingredientsElements.amount.replace(".", ",");
          }
        }
        ingredientsElements.unit = recipeArray[i].substring(recipeArray[i].indexOf(";") + 1, recipeArray[i].lastIndexOf(";"));
        ingredientsElements.content = recipeArray[i].substring(recipeArray[i].lastIndexOf(";") + 1);

        document.getElementById("ingredients").innerHTML += '<tr><td class="ing_amount">'
                                                         + ingredientsElements.amount
                                                         + '</td><td class="ing_unit">'
                                                         + ingredientsElements.unit
                                                         + '</td><td class="ing_content">'
                                                         + ingredientsElements.content
                                                         + '</td></tr>';
      }
      else {
        console.log(document.getElementById("ingredients").innerHTML != "");
        if(document.getElementById("ingredients").innerHTML != "") {
          document.getElementById("ingredients").innerHTML += '<tr><td><br></td></tr>';
        }
        document.getElementById("ingredients").innerHTML += '<tr class="ing_head"><td colspan="3">'
                                                         + recipeArray[i]
                                                         + ':</td></tr>';
      }
      }
    console.log("%cHTML-Constructor %cinserted ingredients", "font-weight: bold", "");
  }

  if(recipeArrayDataPos.preparation.index != undefined) {
    for(i = recipeArrayDataPos.preparation.index; i <= recipeArrayDataPos.preparation.end; i++) {
      if(/^<img>.*/.test(recipeArray[i])) {
        document.getElementById("prepcontent").innerHTML += '<img src="_REZEPTE_/img/'
                                                         + currentRecipe
                                                         + '/'
                                                         + recipeArray[i].replace(/^<img>(.*)/, "$1")
                                                         + '">';
      }
      else if (/^<space>.*/.test(recipeArray[i])) {
        document.getElementById("prepcontent").innerHTML += '<p><br></p>';
      }
      else {
        document.getElementById("prepcontent").innerHTML += '<p>'
                                                         + recipeArray[i]
                                                         + '</p>';
      }
    }
    console.log("%cHTML-Constructor %cinserted preparation", "font-weight: bold", "");
  }

  setTimeout(function() {
    document.getElementById("loader").classList.add("hideloader");
  }, 1000);
  console.log("Recipe page is done");
}
///////////////////////////////////
//generate sidebar of recipe page//
///////////////////////////////////

//global variables for sidebar generation
var rawRecipeList;
var arrayRecipeList;
const recipeListUrl = "./_REZEPTE_/_Rezeptliste.php";

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

  checkAvailability();
  generateSidebar();
}

function generateSidebar() {
  //generate the HTML code for the sidebar
  var sidebarRecipeList = "";
  var insertCurrent = "";
  arrayRecipeList.forEach(function(element) {
    //displays which recipe is currently active
    insertCurrent = "";
    if(element == currentRecipe) {
      insertCurrent = ' class="current"'
    }
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


//////////////////
//run from start//
//////////////////

getRawRecipeList();
