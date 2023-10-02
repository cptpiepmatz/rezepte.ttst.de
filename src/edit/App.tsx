import React, {Component, createContext} from "react";

import Recipe from "../recipes/components/Recipe";
import RecipeData from "../recipes/Recipe";
import RecipeParser from "../recipes/RecipeParser";
import Layout from "../layout/Layout";


export default class App extends Component<any, {recipe?: RecipeData}> {

  static RecipesContext = createContext<string[] | undefined>(undefined);
  static QueriedRecipeContext = createContext<string | undefined>(undefined);

  constructor(props: any) {
    super(props);
    this.state = {};
  }

  render() {
    console.log(this.state.recipe);
    return (
      <App.RecipesContext.Provider value={undefined}>
        <App.QueriedRecipeContext.Provider value={undefined}>
          <Layout>
            {this.state.recipe && <Recipe recipe={this.state.recipe}></Recipe> }
          </Layout>
        </App.QueriedRecipeContext.Provider>
      </App.RecipesContext.Provider>
    );
  }

  async componentDidMount() {
    let recipe = await this.fetchRecipe();
    this.setState({recipe});
    console.log(this.state.recipe);
  }

  async fetchRecipe(): Promise<RecipeData> {
    let recipeNameRes = await fetch("/name");
    let recipeName = await recipeNameRes.text();

    let recipeResponse = await fetch("/recipe");
    let recipeRaw = await recipeResponse.text();
    return RecipeParser.parse(recipeRaw, recipeName);
  }

}
