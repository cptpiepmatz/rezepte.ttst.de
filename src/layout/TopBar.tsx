import {Component} from "react";

import logo from "../logo.svg";

export default class TopBar extends Component {
  render() {
    return <>
      <div className={"navbar is-justify-content-center has-background-primary"}>
        <div className={"navbar-brand"}>
          <a className={"navbar-item"} href="/">
            <img src={logo} alt="logo" style={{maxHeight: "3rem"}}/>
          </a>
        </div>
      </div>
    </>
  }
}
