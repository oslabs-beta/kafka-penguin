import * as React from 'react';
import { FC } from 'react';
import {
  Container, createStyles, makeStyles, Backdrop, CircularProgress, Theme, Typography, Divider,
} from '@material-ui/core';
import TopicsContainer from './TopicsContainer';
import StrategyContainer from './StrategyContainer';
import MessageErrorContainer from './MessageErrorContainer';
import { TopicsProvider } from '../context/TopicContext';
import { MessageProvider } from '../context/MessageContext';
import { ErrorProvider } from '../context/ErrorContext';
import { useBackdropContext, useBackdropUpdateContext } from '../context/BackDropContext';

const MainContainer: FC = () => {
  const useStyles = makeStyles((theme: Theme) => createStyles({
    wrapper: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
    },
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      alignContent: 'center',
      flexDirection: 'column',
    },
    button: {
      margin: '1rem 1rem 1rem 1rem',
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
    divider: {
      height: '1px',
    },
  }));

  const classes = useStyles();
  const backdropContext = useBackdropContext();
  const backdropUpdate = useBackdropUpdateContext();

  return (
    <Container className={classes.wrapper}>
      <Typography variant="h3" color="textPrimary" align="center" gutterBottom>
        DEMO
      </Typography>
      <Divider className={classes.divider} variant="middle" flexItem />
      <Typography variant="h6" color="textSecondary" gutterBottom>
        Trigger errors to see kafka-penguin in action
      </Typography>
      <Typography color="textSecondary">
        Errors can be triggered by publishing to a non-existent
        topic or prescribing a number of faults.
      </Typography>
      <Typography color="textSecondary" gutterBottom>
<<<<<<< HEAD
        Enter in a topic, message and choose your strategy to test with our sample cluster.
      </Typography>
      <Typography align="center" variant="overline" color="textSecondary" gutterBottom>
=======
        Enter in a topic, message and choose your strategy to get started.
      </Typography>
      <Typography align="center" variant='overline' color="textSecondary" gutterBottom>
>>>>>>> bfb793082b2408c916e8fa639b904b9a49741a15
        Load demo topics
        <br />
        Publish either to existent topic or non-existent topic
        <br />
        Select retries
        <br />
        Execute strategy
      </Typography>
      <Typography color="textSecondary" variant="subtitle2">
<<<<<<< HEAD
        * DLQ and Ignore require repeats to be greater than faults
=======
        * DLQ requires repeats to be higher than faults
>>>>>>> bfb793082b2408c916e8fa639b904b9a49741a15
      </Typography>
      <ErrorProvider>
        <MessageProvider>
          <Container className={classes.container}>
            <MessageErrorContainer />
          </Container>
          <Container className={classes.container}>
            <StrategyContainer />
          </Container>
        </MessageProvider>
      </ErrorProvider>
      <TopicsProvider>
        <Container className={classes.container}>
          <TopicsContainer />
        </Container>
      </TopicsProvider>
      <Backdrop
        className={classes.backdrop}
        open={backdropContext}
        onClick={backdropUpdate.handleClose}
      >
        <CircularProgress color="secondary" />
      </Backdrop>
    </Container>
  );
};

export default MainContainer;
