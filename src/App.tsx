import React, {Component} from "react";

import Layout from "./layout/Layout";
import RecipeParser from "./recipes/RecipeParser";
import Recipe from "./recipes/components/Recipe";
import RecipeData from "./recipes/Recipe";
import Landing from "./Landing";

export default class App extends Component<any, {recipe?: RecipeData}> {

  private readonly queriedRecipe?: string;

  constructor(props: any) {
    super(props);
    this.queriedRecipe = this.props.search?.match(/recipe=([^&]*)/)?.[1];
  }

  render() {
    return (
      <Layout>
        {this.queriedRecipe && <Recipe {...this.state?.recipe}/>}
        {!this.queriedRecipe && <Landing/>}
      </Layout>
    );
  }

  componentDidMount() {
    this.fetchRecipe().then(recipe => this.setState({recipe}));
  }

  componentDidUpdate() {
    const title = "rezepte.ttst.de";
    if (this.queriedRecipe) {
      document.title = `${decodeURI(this.queriedRecipe)} | ${title}`;
    }
    else document.title = title;
  }

  async fetchRecipe(): Promise<RecipeData | undefined> {
    if (this.queriedRecipe) {
      let recipeName = decodeURI(this.queriedRecipe);
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
