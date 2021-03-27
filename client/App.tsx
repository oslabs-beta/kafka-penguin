import * as React from 'react';
import { Switch, Route, Router, Link, useLocation } from 'react-router-dom';
import ClientLogin from './components/ClientLogin'
import MainContainer from './containers/MainContainer';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

const App = () => {
  const drawerWidth = 100;

  const useStyles = makeStyles((theme: Theme) => 
    createStyles({   
      container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
    })
  );

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

  const classes = useStyles();

  return (
    <Container maxWidth="sm">
      <div className={classes.container}>
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
    </Container>
  )
  
  
}

export default App