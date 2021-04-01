import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
     root: {
    //   width: '100vw',
    //   padding: '0px',
    //   justifyContent: 'flex-end'
       }
  }));

  export default function LandingBody(){
    const classes = useStyles();
 
    return (
       <div className={classes.root}>
            <Button color="inherit">Documentation</Button>
            <Button color="inherit" href="https://github.com/oslabs-beta/kafka-penguin">Github</Button>
        </div>
    );
  }