import React from 'react';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import { makeStyles, createStyles, Container, Button, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => 
  createStyles({
  button: {
    margin: '1rem 1rem 1rem 1rem'
    },  
}));

const LandingBody: FC = () => {

  const classes = useStyles();
  return (
    <Container align='center' maxWidth='md'>
      <Button className={classes.button} component={ Link } to="/docs" >Documentation</Button>
      <Button className={classes.button} href='https://www.npmjs.com/package/kafka-penguin'>Download</Button>
      <Button className={classes.button} href="https://github.com/oslabs-beta/kafka-penguin">Github</Button>
    </Container>
  
  );
}

export default LandingBody