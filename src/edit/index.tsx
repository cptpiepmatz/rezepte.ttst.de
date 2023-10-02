import React from "react";

import "../index.scss";
import App from "./App";
import {createRoot} from "react-dom/client";
import {BrowserRouter} from "react-router-dom";
import Location from "../Location";

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

