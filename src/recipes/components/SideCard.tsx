import {Component} from "react";

import RecipeData from "../Recipe"
import {gen_recipe_pdf} from "recipe-pdf";

export default class SideCard extends Component<{recipe: RecipeData}> {
  render() {
    if (!(
        this.props.recipe.resultImage ||
        this.props.recipe.pdf ||
        this.props.recipe.inspiration
    )) {
      return null;
    }

    return <>
      <div className={"card"}>
        {
          this.props.recipe.resultImage &&
          <div className={"card-image"}>
            <figure className={"image"}>
              <img src={this.props.recipe.resultImage} alt=""/>
            </figure>
          </div>
        }
        {
          <div className={"card-content p-0"}>
            <a onClick={() => this.genPDF()}>
              <p className={"p-3"}>📝 PDF generieren</p>
            </a>
          </div>
        }
        {
          this.props.recipe.pdf &&
          <div className={"card-content p-0"}>
            <a href={this.props.recipe.pdf} target={"_blank"}>
              <p className={"p-3"}>🖨️ PDF zum ausdrucken</p>
            </a>
          </div>
        }
        {
          this.props.recipe.inspiration &&
          <div className={"card-content p-0"}>
            <a href={this.props.recipe.inspiration} target="_blank">
              <p className={"p-3"}>💡 Inspiration</p>
            </a>
          </div>
        }
      </div>
    </>
  }

  genPDF() {
    let buffer = gen_recipe_pdf(JSON.stringify(this.props.recipe));
    let blob = new Blob([buffer], {type: "application/pdf"});
    let url = URL.createObjectURL(blob);
    window.open(url);
  }
}
