import * as React from "react";
export interface HelloWorldProps {
  userName: string;
  library: string;
}
export const App = (props: HelloWorldProps) => (
    <div>
  <h1>
    Hi {props.userName} from React! Welcome to {props.library}!
  </h1>
{/* Conditional Rendering upon the occurrence of an error: */}
  <p>
      FailSafe Strategy 
      <br />
      <br />
      Your current error status: {'none'}
  </p>
  </div>
);