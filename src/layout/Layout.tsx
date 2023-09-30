import {Component, ReactNode} from "react";

import TopBar from "./TopBar";
import Footer from "./Footer";
import NavMenu from "./NavMenu";
import Location from "../Location";

interface LayoutProps {
  children: ReactNode
}

export default class Layout extends Component<LayoutProps> {
  render() {
    return <>
      <div className={"hero is-fullheight"}>
        <div className={"hero-head"}>
          <TopBar/>
        </div>
        <div className={"hero-body p-0 is-flex is-align-self-center"} style={{maxWidth: "1920px", width: "100%"}}>
          <div className={"columns is-align-self-stretch m-0"} style={{width: "100%"}}>
            <div className={"column is-one-quarter p-0"}>
              <Location>
                <NavMenu className={"is-hidden-mobile"}/>
              </Location>
            </div>
            <div className={"column"}>
              <main className={"container"}>
                {this.props.children}
              </main>
            </div>
          </div>
        </div>
        <div className={"hero-foot"}>
          <Footer/>
        </div>
      </div>
    </>
  }

}
