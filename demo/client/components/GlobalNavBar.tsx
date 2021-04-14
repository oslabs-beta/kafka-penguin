import * as React from 'react';
import { useState, FC } from 'react';
// import { Link } from 'react-router-dom';
import { createStyles, makeStyles, withStyles, AppBar, Toolbar, IconButton, Button, Container, Theme, Icon } from '@material-ui/core';
import { Link } from 'react-scroll'
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
      padding: 0,
    },
  }})(() => null);

const GlobalNavBar: FC = () => {
  const classes = useStyles();
  return (
  <div className={classes.root}>
    <GlobalCss/>
      <AppBar>
        <Toolbar className={classes.landingButtons}>
          <IconButton className={classes.button}>
            <Icon 
              component={ Link } to="top"
              activeClass='active'
              spy={true}
              smooth={true}
              >
              <img src='/assets/penguin.svg'></img>
            </Icon>
          </IconButton>
          <Button 
            className={classes.button}  
            component={ Link } to="features" 
            activeClass='active'
            spy={true}
            offset={-75}
            smooth={true}
            color="inherit">
            Features
          </Button>
          <Button 
            className={classes.button}  
            component={ Link } to="demo" 
            activeClass='active'
            spy={true}
            offset={-75}
            smooth={true}
            color="inherit">
            Demo
          </Button>
          <Button 
            className={classes.button}
            color="inherit" 
            href="https://app.gitbook.com/@kafka-penguin-1/s/kafka-penguin/">  
            Docs
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