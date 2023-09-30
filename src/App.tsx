import React, {Component, createContext} from "react";

import Layout from "./layout/Layout";
import RecipeParser from "./recipes/RecipeParser";
import Recipe from "./recipes/components/Recipe";
import RecipeData from "./recipes/Recipe";
import Landing from "./Landing";
import NotFound from "./error/NotFound";

const STORAGE_KEY = "recipes_v2";

let RECIPE_LIST: [string, number][] | undefined = undefined;

interface AppProps {
  queriedRecipe?: string,
  recipe?: RecipeData,
  recipes?: string[],
  error: number
}

export default class App extends Component<any, AppProps> {

  static RecipesContext = createContext<string[] | undefined>(undefined);
  static QueriedRecipeContext = createContext<string | undefined>(undefined);

  private readonly queriedRecipe?: string;
  private recipeList?: [string, number][];

  constructor(props: any) {
    super(props);
    let queriedRecipe = this.props.search?.match(/recipe=([^&]*)/)?.[1];

    this.recipeList = RECIPE_LIST;
    let recipes: string[] | undefined;
    if (this.recipeList) {
      recipes = Array.from(this.recipeList.map(([name, timestamp]) => name));
    }

    this.state = {error: 0, queriedRecipe, recipes};
  }

  render() {
    return (
      <App.RecipesContext.Provider value={this.state.recipes}>
        <App.QueriedRecipeContext.Provider value={this.state.queriedRecipe}>
          <Layout>
            {this.state.queriedRecipe && !this.state.error && this.state.recipe &&
                <Recipe recipe={this.state.recipe}/>}
            {this.state.queriedRecipe && (this.state.error === 404) && <NotFound/>}
            {!this.state.queriedRecipe && <Landing/>}
          </Layout>
        </App.QueriedRecipeContext.Provider>
      </App.RecipesContext.Provider>
    );
  }

  async componentDidMount() {
    if (!this.recipeList) {
      this.recipeList = await this.fetchRecipeList();
      RECIPE_LIST = this.recipeList;
    }

    let recipe = await this.fetchRecipe(Object.fromEntries(this.recipeList));
    this.setState({
      recipe,
      recipes: Array.from(this.recipeList.map(([name, timestamp]) => name))
    });
  }

  componentDidUpdate() {
    const title = "rezepte.ttst.de";
    if (this.queriedRecipe) {
      document.title = `${decodeURI(this.queriedRecipe)} | ${title}`;
    } else document.title = title;
  }

  async fetchRecipeList(): Promise<[string, number][]> {
    let response = await fetch("/_REZEPTE_/_Rezeptliste.php");
    if (!response.ok) {
      this.setState({error: response.status});
      throw new Error("could not fetch recipes");
    }

    let raw = await response.text();
    return raw
      .trim()
      .split("\n")
      .map(e => e.trim())
      .map(e => e.split("?"))
      .map(([name, timestamp]) => [name, +timestamp]);
  }

  async fetchRecipe(
    recipeTimestamps: Record<string, number>
  ): Promise<RecipeData | undefined> {
    if (this.state.queriedRecipe) {
      let recipeName = decodeURI(this.state.queriedRecipe);
      let recipeTimestamp = recipeTimestamps[recipeName];
      let recipeResponse = await fetch(
        `/_REZEPTE_/${recipeName}.rezept.txt?${recipeTimestamp}`
      );
      if (!recipeResponse.ok) {
        this.setState({error: recipeResponse.status});
        return;
      }
      let recipeRaw = await recipeResponse.text();
      return RecipeParser.parse(recipeRaw, recipeName);
    }
    return undefined;
  }
}
