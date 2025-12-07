import RecipeOptions from "./recipe-options";

/** Class representing a recipe. */
export default class Recipe {
  /** The name of the recipe. */
  readonly name: RecipeOptions["name"];
  /** The name of the image that show the finished recipe. */
  readonly resultImage: RecipeOptions["resultImage"];
  /** The ingredients of the recipe. */
  readonly ingredients: RecipeOptions["ingredients"];
  /** The preparation of the recipe. */
  readonly preparation: RecipeOptions["preparation"];
  /** The name of the pdf file. */
  readonly pdf: RecipeOptions["pdf"];
  /** A link to the inspiration of the recipe. */
  readonly inspiration: RecipeOptions["inspiration"];

  /**
   * Constructor.
   *
   * The resultImage, pdf and images in the preparation will automatically be
   * prepended by the necessary path.
   * @param options The options to construct the recipe, may the returned by
   *                {@link RecipeParser#parse}
   */
  constructor(options: RecipeOptions) {
    Object.assign(this, options);
    if (options.resultImage) {
      this.resultImage =
        `/.recipes/img/${options.name}/${options.resultImage}`;
    }
    if (options.pdf) {
      this.pdf = `/.recipes/pdf/${options.pdf}`;
    }
    if (options.preparation) {
      this.preparation = options.preparation
        // because I'm lazy this currently removes the alt text of the images
        // TODO: fix this some time
        .replaceAll(
          /!\[(?:!(?:\d+(?:cm|mm))? )?(?<alt>.*)\]\((?<url>.*)\)/g,
          (match, p1, p2, offset, string, namedGroups) =>
            `![${namedGroups.alt}](${
              encodeURI(`.recipes/img/${this.name}/${namedGroups.url}`)
            })`,
        );
    }
  }
}
