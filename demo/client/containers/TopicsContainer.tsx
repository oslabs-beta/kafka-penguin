import * as React from 'react';
import { FC } from 'react';
import {
  createStyles, makeStyles, Container, Button,
} from '@material-ui/core';
import Topic from '../components/Topic';
import { useTopicsContext, useTopicsContextUpdate } from '../context/TopicContext';
import { useBackdropUpdateContext } from '../context/BackDropContext';

const useStyles = makeStyles(() => createStyles({
  topicsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    margin: '1rem 1rem 1rem 1rem',
  },
}));

const TopicsContainer: FC = () => {
  const backdropUpdate = useBackdropUpdateContext();
  const topicsUpdate = useTopicsContextUpdate();
  const topics = useTopicsContext();
  const topicsMapped = topics.map((topicInfo, i) => <Topic key="topic" topicInfo={topicInfo} id={i} />);

  const classes = useStyles();

  return (
    <Container>
      <Container className={classes.topicsContainer}>
        <Button
          className={classes.button}
          color="primary"
          variant="outlined"
          onClick={() => {
            backdropUpdate.handleToggle();
            topicsUpdate.getTopics();
          }}
        >
          Load Demo Topics
        </Button>
        <Button
          className={classes.button}
          color="primary"
          variant="outlined"
          onClick={() => {
            topicsUpdate.clearTopics();
          }}
        >
          Clear Topics
        </Button>
      </Container>
      <Container className={classes.topicsContainer}>
        {topicsMapped}
      </Container>
    </Container>
  );
};

export default TopicsContainer;
