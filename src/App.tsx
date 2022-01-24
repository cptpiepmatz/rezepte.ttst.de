import React, {Component} from "react";

import Layout from "./layout/Layout";
import RecipeParser from "./recipes/RecipeParser";
import Recipe from "./recipes/components/Recipe";
import RecipeData from "./recipes/Recipe";

export default class App extends Component<any, {recipe?: RecipeData}> {

  render() {
    return (
      <Layout>
        <Recipe {...this.state?.recipe}/>
      </Layout>
    );
  }

  componentDidMount() {
    this.fetchRecipe().then(recipe => this.setState({recipe}));
  }

  async fetchRecipe(): Promise<RecipeData | undefined> {
    let queriedRecipe = this.props.search?.match(/recipe=([^&]*)/)?.[1];
    if (queriedRecipe) {
      let recipeName = decodeURI(queriedRecipe);
      let recipeResponse = await fetch(
        `/_REZEPTE_/${recipeName}.rezept.txt`
      );
      if (!recipeResponse.ok) {} // TODO: do stuff if not ok
      let recipeRaw = await recipeResponse.text();
      return RecipeParser.parse(recipeRaw, recipeName);
    }
    return undefined;
  }
}
