import React from 'react';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import { makeStyles, createStyles, Container, Divider, Theme, Typography } from '@material-ui/core';
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
    flexDirection: 'column',
   
    },
  inner: {
    display: 'flex',
    // flexDirection: 'column',
    // alignContent: 'center',
    // justifyContent: 'center',
    alignItems: 'center',
    height: '30vh',
    marginTop: '3vh',
    marginBottom: '5vh',
    background: theme.palette.background.default
  },
  icon: {
    fontSize: '10vh',
    color: theme.palette.text.secondary,
    padding: '2vh'
  }  
    
  })
);

const LandingBody: FC = () => {

  const classes = useStyles();
  return (
    <>
    {/* <Typography variant='button' color='textSecondary' align='center' gutterBottom>
      plugin for kafkajs
    </Typography>
    <Container 
      align='center' 
      maxWidth='md'> 
      <Button 
        className={classes.button} 
        color='secondary' 
        variant='outlined'  
        href='https://www.npmjs.com/package/kafka-penguin'>
          Download
      </Button>
      <Button 
        className={classes.button} 
        color='secondary' 
        component={ Link } to="/demo"
        variant='outlined'>
          Demo
      </Button>
    </Container> */}
    <Container className={classes.container}>
      <Typography variant='h3' color='textPrimary' align='center' gutterBottom>
        FEATURES
      </Typography>
      <Divider variant='middle' />
      <Container className={classes.inner}>
        <FitnessCenterRoundedIcon className={classes.icon} fontSize='large'/>
        <Typography variant='h5' align='center' color='textSecondary' gutterBottom>
          LIGHT-WEIGHT        
        </Typography>      
      </Container>
      <Container className={classes.inner}>
        <AccessibilityNewRoundedIcon className={classes.icon} fontSize='large'/>
        <Typography variant='h5' align='center' color='textSecondary' gutterBottom>
          EASY-TO-USE
        </Typography>        
      </Container>
      <Container className={classes.inner}>
        <ErrorOutlineRoundedIcon className={classes.icon} fontSize='large'/>
        <Typography variant='h5' align='center' color='textSecondary' gutterBottom>
          ERROR-HANDLING        
        </Typography>   
      </Container>
    </Container>    
  </>
  );
}

export default LandingBody