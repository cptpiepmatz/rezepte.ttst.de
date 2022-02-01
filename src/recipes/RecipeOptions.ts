import Ingredient from "./Ingredient";

/** Options to construct a {@link Recipe}. */
type RecipeOptions = Partial<{
  /** The name of the recipe. */
  name: string;
  /** The name of the image that show the finished recipe. */
  resultImage: string;
  /** The ingredients of the recipe. */
  ingredients: Partial<{
    _: Ingredient[];
    [key: string]: Ingredient[];
  }>;
  /** The preparation of the recipe. */
  preparation: string;
  /** The name of the pdf file. */
  pdf: string;
  /** A link to the inspiration of the recipe. */
  inspiration: string;
}>;

export default RecipeOptions;
