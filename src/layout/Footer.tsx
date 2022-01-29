import {Component} from "react";

export default class Footer extends Component {
  render() {
    return <>
      <footer className={"footer has-background-black-ter has-text-white-ter"}>
        <p className={"has-text-centered pb-4"}>
          <b>rezepte.tts.de</b> entwickelt von <a
            className={"has-text-white-ter"}
            href={"https://cptpiepmatz.de"}
            target={"_blank"}
          >
            <b>Tim Hesse</b>
          </a> mit <a
          className={"has-text-white-ter"}
          href={"https://bulma.io"}
          target={"_blank"}
        >
          <b>Bulma</b>
        </a> und <a
          className={"has-text-white-ter"}
          href={"https://reactjs.org"}
          target={"_blank"}
        >
          <b>React</b>
        </a>
        </p>
        <div className={"menu has-text-centered"}>
            <ul className={"menu-list"}>
              <li>
                <a href={"https://github.com/cptpiepmatz/rezepte.ttst.de"} target={"_blank"}>
                  📖 Quellcode
                </a>
              </li>
              <li>
                <a href={"mailto:mail@ttst.de"}>
                  📧 Schick 'ne Mail
                </a>
              </li>
            </ul>
          </div>
      </footer>
    </>
  }
}
