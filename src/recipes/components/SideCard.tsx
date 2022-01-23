import {Component} from "react";
import RecipeOptions from "../RecipeOptions";

export default class SideCard extends Component<RecipeOptions> {

  constructor(props: RecipeOptions) {
    super(props);
  }

  render() {
    if (!(this.props.resultImage || this.props.pdf || this.props.inspiration)) {
      return null;
    }

    return <>
      <div className={"card"}>
        {
          this.props.resultImage &&
          <div className={"card-image"}>
            <figure className={"image"}>
              <img src={this.props.resultImage} alt=""/>
            </figure>
          </div>
        }
        {
          this.props.pdf &&
          <div className={"card-content p-0"}>
            <a href={this.props.pdf} target={"_blank"}>
              <p className={"p-3 has-text-primary"}>🖨️ PDF zum ausdrucken</p>
            </a>
          </div>
        }
        {
          this.props.inspiration &&
          <div className={"card-content p-0"}>
            <a href={"/"}>
              <p className={"p-3 has-text-primary"}>💡 Inspiration</p>
            </a>
          </div>
        }
      </div>
    </>
  }
}
