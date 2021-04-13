import React from 'react';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import { makeStyles, createStyles, Container, Button, Theme, Typography } from '@material-ui/core';
import ErrorOutlineRoundedIcon from '@material-ui/icons/ErrorOutlineRounded';
import FitnessCenterRoundedIcon from '@material-ui/icons/FitnessCenterRounded';
import AccessibilityNewRoundedIcon from '@material-ui/icons/AccessibilityNewRounded';

const useStyles = makeStyles((theme: Theme) => 
  createStyles({
  button: {
    margin: '1rem 1rem 1rem 1rem'
    },  
  container: {
    display: 'flex',
    background: theme.palette.background.default
    },
  inner: {
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center',
    alignItems: 'center'
  },
  icon: {
    maxHeight: '2em',
    color: theme.palette.text.secondary
  }  
    
  })
);

const LandingBody: FC = () => {

  const classes = useStyles();
  return (
    <>
    <Typography variant='button' color='textSecondary' align='center' gutterBottom>
      plugin for kafkajs
    </Typography>
    <Container className={classes.container}>
      <Container className={classes.inner}>
        <Typography variant='h5' align='center' color='textSecondary' gutterBottom>
          LIGHT-WEIGHT        
        </Typography>
        <FitnessCenterRoundedIcon className={classes.icon} fontSize='large'/>
      </Container>
      <Container className={classes.inner}>
        <Typography variant='h5' align='center' color='textSecondary' gutterBottom>
          EASY-TO-USE
        </Typography>
        <AccessibilityNewRoundedIcon className={classes.icon} fontSize='large'/>
      </Container>
      <Container className={classes.inner}>
        <Typography variant='h5' align='center' color='textSecondary' gutterBottom>
          ERROR-HANDLING        
        </Typography>
        <ErrorOutlineRoundedIcon className={classes.icon} fontSize='large'/>
      </Container>
    </Container>
    <Container align='center' maxWidth='md'> 
      <Button 
        className={classes.button} 
        component={ Link } 
        color='secondary' 
        variant='outlined' 
        to="/docs" >Documentation</Button>
      <Button 
        className={classes.button} 
        color='secondary' 
        variant='outlined'  
        href='https://www.npmjs.com/package/kafka-penguin'>Download</Button>
      <Button 
        className={classes.button} 
        color='secondary' 
        variant='outlined'  
        href="https://github.com/oslabs-beta/kafka-penguin">Github</Button>
    </Container>
  </>
  );
}

export default LandingBody