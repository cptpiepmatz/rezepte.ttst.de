import {Component} from "react";
import {Link} from "react-router-dom";

const STORAGE_KEY = "recipes";

export default class NavMenu extends Component<any, {recipes: string[]}> {

  constructor(props: any) {
    super(props);
    let localRecipes = window.localStorage.getItem(STORAGE_KEY) ?? "[]";
    this.state = {recipes: JSON.parse(localRecipes)};
  }

  render() {
    let queriedRecipe = this.props.search?.match(/recipe=([^&]*)/)?.[1];
    queriedRecipe = queriedRecipe ? decodeURI(queriedRecipe) : undefined;

    return <>
      <nav className={"menu navMenu p-3 " + this.props.className} style={{height: "100%"}}>
        <p className={"menu-label"}>Rezepte</p>
        <ul className={"menu-list"}>
          {
            this.state.recipes.map(recipe => {
              if (recipe === queriedRecipe) {
                return <li key={recipe}>
                  <Link
                    className={"has-background-primary has-text-black"}
                    to={`/?recipe=${encodeURI(recipe)}`}
                  >
                    {recipe}
                  </Link>
                </li>
              }
              return <li key={recipe}>
                <Link to={`/?recipe=${encodeURI(recipe)}`}>
                  {recipe}
                </Link>
              </li>
            })
          }
        </ul>
      </nav>
    </>
  }

  componentDidMount() {
    this.fetchRecipeList()
      .then(recipes => {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
        this.setState({recipes});
      });
  }

  async fetchRecipeList() {
    let response = await fetch("/_REZEPTE_/_Rezeptliste.php");
    let raw = await response.text();
    return raw.trim().split("\n").map(e => e.trim());
  }
}
