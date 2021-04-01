import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { sizing } from '@material-ui/system'
const useStyles = makeStyles((theme) => ({
  root: {
    width: '100vw',
    padding: '0px',
    justifyContent: 'flex-end'
    },
    landingButtons: {
      display: 'flex',
      alignItems: 'flex-end' 
    }
  
  
  // menuButton: {
  //   marginRight: theme.spacing(2),
  // },
}));

const GlobalCss = withStyles({
  "@global": {
    "html, body": {
      margin: 0,
      padding: 0
    },
  }})(() => null);

export default function LandingNavBar() {
  const classes = useStyles();
  // const classes = GlobalCss();
  return (
     <div className={classes.root}>
    <GlobalCss/>
      <AppBar position="static">
        <Toolbar>
          {/* <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton> */}
          <div className={classes.landingButtons}>
          <Button color="inherit">Docs</Button>
          <Button color="inherit">Demo</Button>
          <Button color="inherit" href="https://github.com/oslabs-beta/kafka-penguin">Github</Button>
          </div>
        </Toolbar>
      </AppBar>
      </div>
  );
}

