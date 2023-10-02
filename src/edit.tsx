import React from "react";
import {BrowserRouter} from "react-router-dom";

import "./index.scss";
import App from "./App";
import Location from "./Location";
import {createRoot} from "react-dom/client";

const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Location>
        <App/>
      </Location>
    </BrowserRouter>
  </React.StrictMode>
);

