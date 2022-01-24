import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter} from "react-router-dom";

import "./index.scss";
import App from "./App";
import Location from "./Location";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Location>
        <App/>
      </Location>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

