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
  }));

  const classes = useStyles();
  const backdropContext = useBackdropContext();
  const backdropUpdate = useBackdropUpdateContext();

  return (
    <>
      <Container className={classes.wrapper}>
        <Typography variant="h3" color="textPrimary" align="center" gutterBottom>
          DEMO
        </Typography>
        <Divider variant="middle" />
        <Typography variant="h6" color="textSecondary" gutterBottom>
          Trigger errors to see kafka-penguin in action
        </Typography>
        <Typography color="textSecondary">
          Errors can be triggered by publishing to a non-existent
          topic or prescribing a number of faults.
        </Typography>
        <Typography color="textSecondary" gutterBottom>
          Enter in a topic, message and choose your strategy to get started.
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
    </>
  );
};

export default MainContainer;
