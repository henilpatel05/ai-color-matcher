import React from "react";
import ReactDOM from "react-dom";
import ColorMatchApp from "./App";
import './style.css';  // This imports the global styles

ReactDOM.render(
  <React.StrictMode>
    <ColorMatchApp />
  </React.StrictMode>,
  document.getElementById("root")
);
