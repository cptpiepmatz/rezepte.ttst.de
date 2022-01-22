import {Component} from "react";

export default class NavMenu extends Component {
  render() {
    return <>
      <nav className={"menu navMenu p-3"} style={{height: "100%"}}>
        <p className={"menu-label"}>Rezepte</p>
        <ul className={"menu-list"}>
          <li><a className={"has-background-primary has-text-black"} href="/?recipe=Pizza">Pizza</a></li>
          <li><a href="/?recipe=Pizza">Chicken Nuggets</a></li>
        </ul>
      </nav>
    </>
  }
}
