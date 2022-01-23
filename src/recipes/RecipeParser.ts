import Recipe from "./Recipe";
import RecipeOptions from "./RecipeOptions";
import Ingredient from "./Ingredient";

export default class RecipeParser {

  private constructor() {}

  static parse(content: string, name: string): Recipe {
    const resultImageMatcher = /\[Resultatbild\](?<resultImage>[^\[]+)/;
    const pdfMatcher = /\[PDF\](?<pdf>[^\[]+)/;
    const ingredientsMatcher = /\[Zutaten\](?<ingredients>[^\[]+)/;
    const preparationMatcher = /\[Zubereitung\](?<preparation>(!\[.*\]\(.*\)|[^\[])+)/;
    const inspirationMatcher = /\[Inspiration\](?<inspiration>[^\[]+)/;

    let matches: {[Property in keyof RecipeOptions]: string} = {};
    for (let matcher of [
      resultImageMatcher,
      pdfMatcher,
      ingredientsMatcher,
      preparationMatcher,
      inspirationMatcher
    ]) {
      Object.assign(matches, content.match(matcher)?.groups ?? {});
    }

    const recipeOptions: RecipeOptions = {name};
    recipeOptions.resultImage = matches.resultImage?.trim();
    recipeOptions.preparation = matches.preparation?.trim();
    recipeOptions.pdf = matches.pdf?.trim();
    recipeOptions.inspiration = matches.inspiration?.trim();

    if (matches.ingredients) {
      let rows = matches.ingredients.trim().split("\n");
      let section = "_";
      let ingredients: RecipeOptions["ingredients"] = {};
      for (let row of rows) {
        row = row.trim();
        if (row.length === 0) continue;
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
