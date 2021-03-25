import * as React from "react";
import * as ReactDOM from "react-dom";
import { App } from "./components/App";
ReactDOM.render(
  <App userName="Beveloper" lang="TypeScript" />,
  document.getElementById("root")
);


//Add event listener for errors inside fail functions
    //Upon the execution of an error inside the catch statement, 
        //render the error in HTML Text
