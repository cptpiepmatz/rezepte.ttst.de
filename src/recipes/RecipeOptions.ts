import Ingredient from "./Ingredient";

type RecipeOptions = Partial<{
  name: string;
  resultImage: string;
  ingredients: Partial<{
    _: Ingredient[];
    [key: string]: Ingredient[];
  }>;
  preparation: string;
  pdf: string;
  inspiration: string;
}>;

export default RecipeOptions;
