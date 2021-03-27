import * as React from "react";
import { Switch, Route, Router, Link, useLocation } from 'react-router-dom';
import ClientLogin from './components/ClientLogin'
import MainContainer from './containers/MainContainer';

export interface HelloWorldProps {
  userName: string;
  library: string;
}

const App = () => {

  const [redirect, setRedirect] = React.useState(false);

  let main

  // if required port addresses are given, user is redirected automatically to the Cluster Overview
  if (!redirect) {
    main = (
      <Route exact path='/'>
        <ClientLogin setRedirect={setRedirect} />
      </Route>
    );
  } else {
    main = (
      <Route exact path='/'>
        <MainContainer setRedirect={setRedirect} />
      </Route>
    );
  }

    return (
      <div className="router">
            <Switch>
              {main}
              <Route exact path="/">
                <ClientLogin setRedirect={setRedirect} />
              </Route>
              <Route exact path='/main'>
                <MainContainer setRedirect={setRedirect}/>
              </Route>
            </Switch>
      </div>
    )
  
  
}

export default App