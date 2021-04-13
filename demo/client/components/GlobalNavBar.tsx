import * as React from 'react';
import { useState, FC } from 'react';
import { Link } from 'react-router-dom';
import { createStyles, makeStyles, withStyles, AppBar, Toolbar, IconButton, Button, Container, Theme, Icon } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => 
  createStyles({
    root: {
      width: '100vw',
      padding: 0,
      },
    landingButtons: {
      display: 'flex',
      justifyContent: 'flex-end',
      },
    logo: {
      alignSelf: 'flex-start',
    },
    button: {
      margin: '1rem 1rem 1rem 1rem'
      },  
}));

const GlobalCss = withStyles({
  "@global": {
    "html, body": {
      margin: 0,
      padding: 0
    },
  }})(() => null);

const GlobalNavBar: FC = () => {
  const classes = useStyles();
  return (
  <div className={classes.root}>
    <GlobalCss/>
      <AppBar position="static">
        <Toolbar className={classes.landingButtons}>

            <IconButton className={classes.button}>
            <Icon component={ Link } to="/">
              <img src='/assets/penguin.svg'></img>
            </Icon>
            </IconButton>

          <Button 
            className={classes.button}
            component={ Link } to="/docs"  
            color="inherit">Docs
          </Button>
          <Button 
            className={classes.button}  
            component={ Link } to="/demo" 
            color="inherit">
            Demo
          </Button>
          <Button 
            className={classes.button}  
            color="inherit" 
            href="https://github.com/oslabs-beta/kafka-penguin">
              Github
          </Button>
        </Toolbar>
      </AppBar>
   </div>
  );
}

export default GlobalNavBar;