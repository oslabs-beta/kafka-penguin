import * as React from 'react';
import { useState, FC } from 'react';
import { Switch, Route } from 'react-router-dom';
import ClientLogin from './components/ClientLogin'
import MainContainer from './containers/MainContainer';
import { createStyles, makeStyles, Typography, Container } from '@material-ui/core';

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      flexDirection: 'column',
    },
  })
);

const App: FC = () => {
  const [redirect, setRedirect] = useState(true);
  
  let main

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

    <Container className={classes.container} maxWidth='md'>
      <Typography variant='h1' gutterBottom>kafka-penguin<img style={{'maxHeight': '1em'}} src='/assets/penguin.svg'></img></Typography>    
      <Switch>
        {main}
        < Route exact path="/" >
          <ClientLogin setRedirect={setRedirect} />
        </Route >
        <Route exact path='/main'>
          <MainContainer setRedirect={setRedirect} />
        </Route>
      </Switch>
      {/* <Typography variant='body2' color='textSecondary'> 
      Icons made by <a href="https://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>
      </Typography> */}
    </Container>
  )
}

export default App
