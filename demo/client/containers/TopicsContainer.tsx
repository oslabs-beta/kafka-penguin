import * as React from 'react';
import { FC } from 'react';
import Topic from '../components/Topic';
import { useTopicsContext, useTopicsContextUpdate } from '../context/TopicContext'
import { useBackdropUpdateContext } from '../context/BackDropContext'
import { createStyles, makeStyles, Container, Button } from '@material-ui/core';

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',

    },
    button: {
      margin: '1rem 1rem 1rem 1rem'
    },
  })
);

const TopicsContainer: FC = () => {
  const backdropUpdate = useBackdropUpdateContext()
  const getTopics = useTopicsContextUpdate()
  const topics = useTopicsContext()
  const topicsMapped = topics.map((topicInfo, i) => {
    return <Topic key={i} topicInfo={topicInfo} id={i} />
  })

  const classes = useStyles();

  return (  
    <Container>
      <Container className={classes.container}>
        <Button
          className={classes.button}
          color='secondary'
          variant='outlined'
          onClick={() => {
            backdropUpdate.handleToggle();
            getTopics()
          }}
        >Load Demo Topics
        </Button>
      </Container>
      <Container className = {classes.container}>
       {topicsMapped}
      </Container>  
    </Container>
  )
}

export default TopicsContainer;