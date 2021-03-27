import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import App from "./App";

ReactDOM.render(
<BrowserRouter>
  <App />
</BrowserRouter>,
  document.getElementById("root")
  
);

