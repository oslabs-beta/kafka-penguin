import React from 'react';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import { makeStyles, createStyles, Container, Divider, Theme, Typography } from '@material-ui/core';
import ErrorOutlineRoundedIcon from '@material-ui/icons/ErrorOutlineRounded';
import FitnessCenterRoundedIcon from '@material-ui/icons/FitnessCenterRounded';
import AccessibilityNewRoundedIcon from '@material-ui/icons/AccessibilityNewRounded';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { materialLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

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
      paddingLeft: '5vw',
      paddingRight: '5vw',
      alignContent: 'center',
      justifyContent: 'space-between',
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

const lightWeightCode = 
`import { FailFast } from \'kafka-penguin\';
const failfast = new FailFast(2, kafkaClient);`;

const easyToUseCode =
`const producer = failfast.producer();
producer.connect()
  .then(producer.send(...))`

const errorHandlingCode =
`import { DeadLetterQueue, FailFast, Ignore } from 'kafka-penguin';`  

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
          <Typography variant='h6'>
          Minimal Configuration
          </Typography>
          <Typography>
          A working KafkaJS client and a callback that returns a boolean.  
          </Typography>
          <Typography> 
          That’s all it takes to implement a strategy.
            <SyntaxHighlighter
              language='javascript'
              style={ materialLight }>
              {lightWeightCode}
            </SyntaxHighlighter>   
          </Typography>  
        </Typography> 
      </Container>
      <Container className={classes.inner}>
        <Typography variant='h5' align='center' color='textSecondary' gutterBottom>
          EASY-TO-USE
          <Typography variant='h6'>
          Plug-and-Play
          </Typography>
          <Typography>
          Add one line of code on top of your existing<br></br>
          implementation and keep using KafkaJS as normal. 
            <SyntaxHighlighter
              language='javascript'
              style={ materialLight }>
              { easyToUseCode } 
            </SyntaxHighlighter>   
          </Typography>
        </Typography> 
        <AccessibilityNewRoundedIcon className={classes.icon} fontSize='large'/>       
      </Container>
      <Container className={classes.inner}>
        <ErrorOutlineRoundedIcon className={classes.icon} fontSize='large'/>
        <Typography variant='h5' align='center' color='textSecondary' gutterBottom>
          ERROR-HANDLING
          <Typography variant='h6'>
          Common, Programmable Strategies
          </Typography>
          <Typography>
          Choose from some of the most widely used strategies.
          </Typography>
          <Typography>
          Program them to fit your application’s logic.
            <SyntaxHighlighter
              language='javascript'
              style={ materialLight }>
              { errorHandlingCode }
            </SyntaxHighlighter>  
          </Typography>          
        </Typography>   
      </Container>
    </Container>    
  </>
  );
}

export default LandingBody