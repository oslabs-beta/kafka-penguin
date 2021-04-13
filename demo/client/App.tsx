import * as React from 'react';
import { FC } from 'react';
import { Switch, Route} from 'react-router-dom';
import DocsContainer from './containers/DocsContainer'
import { MainContainer } from './containers/MainContainer';
import { BackdropProvider } from './context/BackDropContext';
import GlobalNavBar from './components/GlobalNavBar'
import { createStyles, makeStyles, Typography, Container } from '@material-ui/core';
import LandingBody from './components/LandingBody';

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
  
  const classes = useStyles();

  return (
    <Container className={classes.container} maxWidth='md'>
      <GlobalNavBar />
      <Typography 
        variant='h1' 
        gutterBottom>kafka-penguin
        <img style={{'maxHeight': '1em'}} src='/assets/penguin.svg'></img>
      </Typography> 
        <Switch>      
          <Route 
            exact path='/demo' 
            component={ () => {
                return (
                <BackdropProvider>
                  <MainContainer />
                </BackdropProvider>  
            )
            }}></Route>   
          <Route 
            exact path="/docs" 
            component={
              () => <DocsContainer/>
          }></Route>      
          <Route 
            exact path="/" 
            component={
              () => <LandingBody/>
            }></Route>     
        </Switch>
    </Container>
  )
}

export default App
