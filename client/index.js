"use strict";
// import * as React from "react";
// import * as ReactDOM from "react-dom";
// import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
// import App from "./App";
// console.log('inside index tsx')
// ReactDOM.render(
// <BrowserRouter>
//   <App />
// </BrowserRouter>,
//   document.getElementById("root")
exports.__esModule = true;
// );
//Copied from https://github.com/Cicko/boilerplates-webpack-typescript-react/blob/master/src/index.tsx
var React = require("react");
var ReactDom = require("react-dom");
var App = function () {
    return <div>Hola amigo mio</div>;
};
ReactDom.render(<App />, document.getElementById('root'));
//Add event listener for errors inside fail functions
//Upon the execution of an error inside the catch statement, 
//render the error in HTML Text
//Display current topics by invoking await admin.listTopics() from example, producer, consumer files
//Display most recent offset for a topic with admin.fetchTopicOffsets
//Display cluster data w/ await admin.describeCluster()
// {
//   brokers: [
//     { nodeId: 0, host: 'localhost', port: 9092 }
//   ],
//   controller: 0,
//   clusterId: 'f8QmWTB8SQSLE6C99G4qzA'
// }
