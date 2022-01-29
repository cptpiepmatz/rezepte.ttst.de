import {Component} from "react";

export default class Footer extends Component {
  render() {
    return <>
      <footer className={"footer has-background-black-ter has-text-white-ter"}>
        <div className={"has-text-centered"}>
          <p className={"block"}>
            <b>rezepte.tts.de</b> entwickelt von <a
            className={"has-text-white-ter"}
            href={"https://cptpiepmatz.de"}
            target={"_blank"}
          >
            <b>Tim Hesse</b>
          </a>
          </p>
          <div className={"columns is-centered"}>
            <div className={"column is-narrow"}>
              <div className={"block mb-2"}>
                <a
                  href="https://reactjs.org"
                  className={"has-hover-text-white"}
                  target={"_blank"}
                >
                  💻 Entwickelt in <b>React</b>
                </a>
              </div>
            </div>
            <div className={"column is-narrow"}>
              <div className={"block mb-2"}>
                <a
                  href="https://bulma.io"
                  className={"has-hover-text-white"}
                  target={"_blank"}
                >
                  🖌️ Gestaltet mit <b>Bulma</b>
                </a>
              </div>
            </div>
            <div className={"column is-narrow"}>
              <div className={"block mb-2"}>
                <a
                  href={"https://github.com/cptpiepmatz/rezepte.ttst.de"}
                  target={"_blank"}
                  className={"has-hover-text-white"}
                >
                  📖 <b>Quellcode</b> der Seite
                </a>
              </div>
            </div>
            <div className={"column is-narrow"}>
              <div className={"block mb-2"}>
                <a
                  href={"mailto:mail@ttst.de"}
                  className={"has-hover-text-white"}
                >
                  📧 Schick 'ne <b>Mail</b>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  }
}
