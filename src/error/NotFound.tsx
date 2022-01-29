import {Component} from "react";

export default class NotFound extends Component {
  render() {
    return <>
      <div className={"section"}>
        <div className={"columns"}>
          <div className={"column is-three-fifths is-offset-one-fifth has-text-centered"}>
            <p className={"title"} style={{fontSize: "10rem"}}>404</p>
            <p className={"subtitle"}>Rezept nicht gefunden</p>
            <div className={"divider"}/>
            <p>Sieht so aus, als hättest du einen Link, der nicht funktioniert.</p>
          </div>
        </div>
      </div>
    </>
  }
}
