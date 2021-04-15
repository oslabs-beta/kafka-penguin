import * as React from 'react';
import { FC } from 'react';
import {
  createStyles, makeStyles, Button, Container,
} from '@material-ui/core';
import { useErrorUpdateContext } from '../context/ErrorContext';
import { useMessageContext } from '../context/MessageContext';
import { useBackdropUpdateContext } from '../context/BackDropContext';

const useStyles = makeStyles(() => createStyles({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'space-between',
  },
  button: {
    margin: '1rem 1rem 1rem 1rem',
  },
}));

const StrategyContainer: FC = () => {
  // After the user clicks on the button FF or DLQ,
  // we will render the associated strategy data
  // to them in a div below
  const message = useMessageContext();
  const handleClicks = useErrorUpdateContext();
  const backdropUpdate = useBackdropUpdateContext();
  const classes = useStyles();

  return (
    <Container className={classes.container}>
      <Button
        className={classes.button}
        color="primary"
        variant="contained"
        onClick={() => {
          if (message.message && message.topic) backdropUpdate.handleToggle();
          handleClicks.handleFailFast(message);
        }}
      >
        FailFast
      </Button>
      <Button
        className={classes.button}
        color="primary"
        variant="contained"
        onClick={() => {
          if (message.message
            && message.topic
            && message.retries > message.faults) backdropUpdate.handleToggle();
          handleClicks.handleDLQ(message);
        }}
      >
        DLQ
      </Button>
      <Button
        className={classes.button}
        color="primary"
        variant="contained"
        onClick={() => {
          if (message.message
            && message.topic
            && message.retries > message.faults) backdropUpdate.handleToggle();
          handleClicks.handleIgnore(message);
        }}
      >
        Ignore
      </Button>
    </Container>
  );
};
export default StrategyContainer;
