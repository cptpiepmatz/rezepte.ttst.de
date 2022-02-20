import {Component} from "react";
import ReactMarkdown from "react-markdown";

import SideCard from "./SideCard";
import Ingredients from "./Ingredients";
import RecipeOptions from "../RecipeOptions";
import rehypeRaw from "rehype-raw";

export default class Recipe extends Component<RecipeOptions> {
  constructor(props: RecipeOptions) {
    super(props);
  }

  // the title may fall back to a zero width space
  render() {
    return <>
      <div className={"is-hidden-tablet"} style={{paddingBottom: "2rem"}}>
        <p className={"title is-2 has-text-centered"}>
          {this.props.name ?? "​"}
        </p>
      </div>
      <div className={"columns is-reversed-mobile"}>
        <div className={"column is-two-thirds"}>
          <p className={"title is-2 has-text-centered is-hidden-mobile"}>
            {this.props.name ?? "​"}
          </p>
          <div className={"divider is-hidden-mobile"}/>
          <Ingredients {...this.props}/>
        </div>
        <div className={"column is-one-third"}>
          <SideCard {...this.props}/>
        </div>
      </div>
      <div className={"p-4 is-hidden-tablet"}/>
      {
        this.props.preparation &&
        <div className={"columns"}>
          <div className={"column is-two-thirds"}>
            <div className={"columns"}>
              <div className={"column is-10 is-offset-1"}>
                <div className={"content preparation"}>
                  <ReactMarkdown children={this.props.preparation} rehypePlugins={[rehypeRaw]}/>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </>
  }
}
