import Recipe from "./recipe";
import RecipeOptions from "./recipe-options";
import Ingredient from "./ingredient";

/** Parser .rezept.txt files to a {@link Recipe}. */
export default class RecipeParser {
  // This is a pure utility function, so the constructor is private
  private constructor() {}

  /**
   * Method to parse the content of a .rezept.txt file.
   * @param content The content of the recipe file.
   * @param name The name of the recipe.
   */
  static parse(content: string, name: string): Recipe {
    // regex matchers for getting the content segments
    const resultImageMatcher = /\[Resultatbild\](?<resultImage>[^\[]+)/;
    const pdfMatcher = /\[PDF\](?<pdf>[^\[]+)/;
    const ingredientsMatcher = /\[Zutaten\](?<ingredients>[^\[]+)/;
    const preparationMatcher =
      /\[Zubereitung\](?<preparation>(!\[.*\]\(.*\)|[^\[])+)/;
    const inspirationMatcher = /\[Inspiration\](?<inspiration>[^\[]+)/;

    // assign every match to a single object to evaluate further
    let matches: { [Property in keyof RecipeOptions]: string } = {};
    for (
      let matcher of [
        resultImageMatcher,
        pdfMatcher,
        ingredientsMatcher,
        preparationMatcher,
        inspirationMatcher,
      ]
    ) {
      Object.assign(matches, content.match(matcher)?.groups ?? {});
    }

    const recipeOptions: RecipeOptions = { name };
    recipeOptions.resultImage = matches.resultImage?.trim();
    recipeOptions.preparation = matches.preparation?.trim();
    recipeOptions.pdf = matches.pdf?.trim();
    recipeOptions.inspiration = matches.inspiration?.trim();

    if (matches.ingredients) {
      // construct the ingredient object
      // the key "_" represents the entries without a group name
      let rows = matches.ingredients.trim().split("\n");
      let section = "_";
      let ingredients: RecipeOptions["ingredients"] = {};
      for (let row of rows) {
        row = row.trim();
        if (row.length === 0) continue; // skip empty lines
        let rowElems = row.split(";");
        if (rowElems.length < 3) {
          section = row;
          continue;
        }
        if (!ingredients[section]) ingredients[section] = [];
        let ingredient = new Ingredient(rowElems[0], rowElems[1], rowElems[2]);
        ingredients[section]!.push(ingredient);
      }
      recipeOptions.ingredients = ingredients;
    }

    return new Recipe(recipeOptions);
  }
}
