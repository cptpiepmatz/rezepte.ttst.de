import {Component} from "react";

import logo from "./logo.svg";

export default class Landing extends Component {
  render() {
    return <>
      <div className={"section"}>
        <div className={"columns"}>
          <div className={"column is-three-fifths is-offset-one-fifth has-text-centered"}>
            <figure className={"is-inverted pr-6 pl-6"}>
              <img src={logo} alt=""/>
            </figure>
            <div className={"divider"}/>
            <p className={"title is-2"}>Rezepte der Familie Hesse</p>
            <p>Hier kannst du Rezepte finden, die allesamt einfach und dabei lecker sind.</p>
          </div>
        </div>
      </div>
    </>
  }
}
