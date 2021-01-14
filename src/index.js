import React from "react";
import ReactDOM from "react-dom";
import { OnboardProvider } from "./context";

import App from "./App";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <React.StrictMode>
    <OnboardProvider>
      <App />
    </OnboardProvider>
  </React.StrictMode>,
  rootElement
);
