import {Component, useContext} from "react";
import {Link} from "react-router-dom";
import App from "../App";

const NavMenu = (props: any) => {
  let queriedRecipe = useContext(App.QueriedRecipeContext);
  let recipes = useContext(App.RecipesContext) ?? [];

  return <>
    <nav className={"menu navMenu p-3 " + props.className} style={{height: "100%"}}>
      <p className={"menu-label"}>Rezepte</p>
      <ul className={"menu-list"}>
        {
          recipes.map((recipe: string) => {
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

export default NavMenu;
