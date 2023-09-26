import {Component} from "react";
import ReactMarkdown from "react-markdown";

import SideCard from "./SideCard";
import Ingredients from "./Ingredients";
import RecipeData from "../Recipe";
import rehypeRaw from "rehype-raw";

export default class Recipe extends Component<{recipe: RecipeData}> {
  // the title may fall back to a zero width space
  render() {
    return <>
      <div className={"is-hidden-tablet"} style={{paddingBottom: "2rem"}}>
        <p className={"title is-2 has-text-centered"}>
          {this.props.recipe.name ?? "​"}
        </p>
      </div>
      <div className={"columns is-reversed-mobile"}>
        <div className={"column is-two-thirds"}>
          <p className={"title is-2 has-text-centered is-hidden-mobile"}>
            {this.props.recipe.name ?? "​"}
          </p>
          <div className={"divider is-hidden-mobile"}/>
          <Ingredients recipe={this.props.recipe}/>
        </div>
        <div className={"column is-one-third"}>
          <SideCard recipe={this.props.recipe}/>
        </div>
      </div>
      <div className={"p-4 is-hidden-tablet"}/>
      {
        this.props.recipe.preparation &&
        <div className={"columns"}>
          <div className={"column is-two-thirds"}>
            <div className={"columns"}>
              <div className={"column is-10 is-offset-1"}>
                <div className={"content preparation"}>
                  <ReactMarkdown children={this.props.recipe.preparation} rehypePlugins={[rehypeRaw]}/>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </>
  }
}
