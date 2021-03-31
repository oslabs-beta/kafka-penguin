import * as React from 'react';
import { useState, useEffect, FC } from 'react';
import { Button, Container, createStyles, makeStyles, Backdrop, CircularProgress, Theme } from '@material-ui/core';
import TopicsContainer from './TopicsContainer';
import StrategyContainer from './StrategyContainer';
import MessageErrorContainer from './MessageErrorContainer'

type Props = {
  setRedirect: (value: boolean) => void
};

const MainContainer: FC<Props> = ({ setRedirect }: Props) => {

  const [topicsArray, changeTopicsArray] = useState([]);
  const [message, changeMessage] = useState('');
  const [topic, changeTopic] = useState('')
  const [error, changeError] = useState([])
  const [retries, changeRetries] = useState(1)
  const [open, setOpen] = useState(false);

  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      },
      button: {
        margin: '1rem 1rem 1rem 1rem'
      },
      backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
      },
    })
  );

  const handleClose = () => {
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen(!open);
  };

  useEffect(() => {
    handleClose()
  }, [error])

  useEffect(() => {
    handleClose()
  }, [topicsArray])

  const handleFailFast = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (!topic || !message) return;
    handleToggle()
    fetch('/strategy/failfast', {
      method: 'POST',
      headers: { 'Content-Type': 'Application/JSON' },
      body: JSON.stringify({ topic: topic, message: message, retries: retries })
    })
      .then(data => data.json())
      .then(errors => {
        changeError(errors)
      })
  };

  const handleDLQ = (e: { preventDefault: () => void; }) => {
    e.preventDefault()
  };
  const handleIgnore = (e: { preventDefault: () => void; }) => {
    e.preventDefault()
  };

  const getTopics = () => {
    handleToggle();
    //FOR TRIALING WITH USER TOPICS, CREATE PAGE WITH
    const userDetails = localStorage.getItem('userDetails')
    fetch('/topic/getTopics', {
      method: 'POST',
      headers: { 'Content-Type': 'Application/JSON' },
      body: userDetails
    })
      .then(data => data.json())
      .then(data => {
        const topicData = data.topics.reduce((acc, cur) => {
          acc.push({
            name: cur.name,
            partitions: cur.partitions.length
          })
          return acc
        }, [])
        changeTopicsArray(topicData)
      })
  }

  const classes = useStyles();
  return (
    <div className="MainContainer">
      <MessageErrorContainer
        changeMessage={changeMessage}
        changeTopic={changeTopic}
        changeRetries={changeRetries}
        updateError={error}
      />
      <Container className={classes.container}>
        <StrategyContainer
          handleFailFast={handleFailFast}
          handleDLQ={handleDLQ}
          handleIgnore={handleIgnore}
        />
        <Button
          className={classes.button}
          color='secondary'
          variant='outlined'
          onClick={getTopics}
        >Load Demo Topics</Button>
      </Container>
      <Container className={classes.container}>
        <TopicsContainer topicsInfo={topicsArray} />
      </Container>
      <Backdrop className={classes.backdrop} open={open} onClick={handleClose}>
        <CircularProgress color='secondary' />
      </Backdrop>
    </div>
  )
}

export default MainContainer;