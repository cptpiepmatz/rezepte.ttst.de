import {Component} from "react";
import {Link} from "react-router-dom";

import NavMenu from "./NavMenu";
import logo from "../logo.svg";

export default class TopBar extends Component<any, {hideNav: boolean}> {

  constructor(props: any) {
    super(props);
    this.state = {hideNav: true};
    this.toggleNav = this.toggleNav.bind(this);
  }

  render() {
    return <>
      <div className={"navbar is-justify-content-center has-background-primary"}>
        <div className={"navbar-brand"}>
          <Link className={"navbar-item"} to="/">
            <img src={logo} alt="logo" style={{maxHeight: "3rem"}}/>
          </Link>
        </div>
        <div
          style={{
            position: "absolute",
            top: "0px",
            right: "0px",
            height: "100%"
          }}
          className={"is-flex is-align-items-center pr-3 is-hidden-tablet"}
        >
          <div className={"button"} onClick={this.toggleNav}>
            <span className={"icon"}>
              ☰
            </span>
          </div>
        </div>
      </div>
      <div
        style={{
          maxHeight: (this.state.hideNav ? 0 : 5000),
          overflowY: "hidden",
          transition: "all",
          transitionDuration: (this.state.hideNav ? "1.2s" : "3s")
        }}
      >
        <NavMenu className={this.state.hideNav ? "" : "is-hidden-tablet"}/>
      </div>
    </>
  }

  toggleNav() {
    this.setState(prevState => ({
      hideNav: !prevState.hideNav
    }));

  }
}
