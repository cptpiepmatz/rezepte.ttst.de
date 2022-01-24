import {Component} from "react";
import ReactMarkdown from "react-markdown";

import SideCard from "./SideCard";
import Ingredients from "./Ingredients";
import RecipeOptions from "../RecipeOptions";

export default class Recipe extends Component<RecipeOptions> {
  constructor(props: RecipeOptions) {
    super(props);
  }

  render() {
    return <>
      <div className={"columns"}>
        <div className={"column is-two-thirds"}>
          <p className={"title is-2 has-text-centered"}>
            {this.props.name ?? "???"}
          </p>
          <div className={"divider"}/>
          <Ingredients {...this.props}/>
        </div>
        <div className={"column is-one-third"}>
          <SideCard {...this.props}/>
        </div>
      </div>
      {
        this.props.preparation &&
        <div className={"columns"}>
          <div className={"column is-two-thirds"}>
            <div className={"columns"}>
              <div className={"column is-10 is-offset-1"}>
                <div className={"content"}>
                  <ReactMarkdown>
                    {this.props.preparation}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </>
  }
}
