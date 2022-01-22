import {Component} from "react";
import TopBar from "./TopBar";
import Footer from "./Footer";
import NavMenu from "./NavMenu";
import Recipe from "../recipes/components/Recipe";

export default class Layout extends Component {
  render() {
    return <>
      <div className={"hero is-fullheight"}>
        <div className={"hero-head"}>
          <TopBar/>
        </div>
        <div className={"hero-body p-0 is-flex is-align-self-center"} style={{maxWidth: "1920px"}}>
          <div className={"columns is-align-self-stretch m-0"} style={{width: "100%"}}>
            <div className={"column is-one-quarter p-0"}>
              <NavMenu/>
            </div>
            <div className={"column"}>
              <main className={"container"}>
                <Recipe {...this.props}/>
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
