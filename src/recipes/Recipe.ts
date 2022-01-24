import RecipeOptions from "./RecipeOptions";

export default class Recipe {

  readonly name: RecipeOptions["name"];
  readonly resultImage: RecipeOptions["resultImage"];
  readonly ingredients: RecipeOptions["ingredients"];
  readonly preparation: RecipeOptions["preparation"];
  readonly pdf: RecipeOptions["pdf"];
  readonly inspiration: RecipeOptions["inspiration"];

  constructor(options: RecipeOptions) {
    Object.assign(this, options);
    if (options.resultImage) {
      this.resultImage = `/_REZEPTE_/img/${options.name}/${options.resultImage}`;
    }
    if (options.pdf) {
      this.pdf = `/_REZEPTE_/pdf/${options.pdf}`;
    }
    if (options.preparation) {
      this.preparation = options.preparation
        .replaceAll(
          /!\[.*\]\((.*)\)/g,
          (match, file) => `![](${encodeURI(`_REZEPTE_/img/${this.name}/${file}`)})`
        );
    }
  }

}
