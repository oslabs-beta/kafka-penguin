import React, { FC } from 'react';
import {
  makeStyles, createStyles, Container, Divider, Theme, Typography,
} from '@material-ui/core';
import ErrorOutlineRoundedIcon from '@material-ui/icons/ErrorOutlineRounded';
import FitnessCenterRoundedIcon from '@material-ui/icons/FitnessCenterRounded';
import AccessibilityNewRoundedIcon from '@material-ui/icons/AccessibilityNewRounded';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { materialLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

const useStyles = makeStyles((theme: Theme) => createStyles({
  button: {
    margin: '1rem 1rem 1rem 1rem',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',

  },
  inner: {
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: '3vh',
    marginBottom: '5vh',
    background: theme.palette.background.default,
  },
  icon: {
    fontSize: '7vh',
    color: theme.palette.primary.light,
    padding: '2vh',
  },
}));

const lightWeightCode = `import { FailFast } from 'kafka-penguin';
const failfast = new FailFast(2, kafkaClient);`;

const easyToUseCode = `const producer = failfast.producer();
producer.connect()
  .then(producer.send(...))`;

const errorHandlingCode = `import { 
  DeadLetterQueue, 
  FailFast, 
  Ignore 
} from 'kafka-penguin';`;

const LandingBody: FC = () => {
  const classes = useStyles();
  return (
    <>
      <Container className={classes.container}>
        <Typography variant="h3" color="textPrimary" align="center" gutterBottom>
          FEATURES
        </Typography>
        <Divider variant="middle" />
        <Container className={classes.inner}>
          <Typography variant="h5" align="center" color="textSecondary" gutterBottom>
            <FitnessCenterRoundedIcon className={classes.icon} />
            <br />
            LIGHT-WEIGHT
            <Typography variant="h6">
              Minimal Configuration
            </Typography>
            <Typography>
              A working KafkaJS client and a callback that returns a boolean.
            </Typography>
            <Typography>
              That’s all it takes to implement a strategy.
            </Typography>
          </Typography>
          <SyntaxHighlighter
            language="javascript"
            style={materialLight}
          >
            {lightWeightCode}
          </SyntaxHighlighter>
        </Container>
        <Container className={classes.inner}>
          <SyntaxHighlighter
            language="javascript"
            style={materialLight}
          >
            { easyToUseCode }
          </SyntaxHighlighter>
          <Typography variant="h5" align="center" color="textSecondary" gutterBottom>
            <AccessibilityNewRoundedIcon className={classes.icon} />
            <br />
            EASY-TO-USE
            <Typography variant="h6">
              Plug-and-Play
            </Typography>
            <Typography>
              Add one line of code on top of your existing
              <br />
              implementation and keep using KafkaJS as normal.
            </Typography>
          </Typography>
        </Container>
        <Container className={classes.inner}>
          <Typography variant="h5" align="center" color="textSecondary" gutterBottom>
            <ErrorOutlineRoundedIcon className={classes.icon} />
            <br />
            ERROR-HANDLING
            <Typography variant="h6">
              Common, Programmable Strategies
            </Typography>
            <Typography>
              Choose from some of the most widely used strategies.
            </Typography>
            <Typography>
              Program them to fit your application’s logic.
            </Typography>
          </Typography>
          <SyntaxHighlighter
            language="javascript"
            style={materialLight}
          >
            { errorHandlingCode }
          </SyntaxHighlighter>
        </Container>
      </Container>
    </>
  );
};

export default LandingBody;
