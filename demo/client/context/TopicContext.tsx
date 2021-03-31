import * as React from 'react';
import { useState, useContext, FC, createContext, useEffect } from 'react';
import { useBackdropUpdateContext } from './BackDropContext'

const TopicsContext = createContext(null);
const TopicsUpdateContext = createContext(null);

const useTopicsContext = () => {
  return useContext(TopicsContext)
}

const useTopicsContextUpdate = () => {
  return useContext(TopicsUpdateContext)
}

const TopicsProvider: FC = ({ children }) => {
  const [topicsArray, changeTopicsArray] = useState([]);

  const backdropUpdate = useBackdropUpdateContext()
  
  useEffect(() => {
    backdropUpdate.handleClose()
  }, [topicsArray])

  const getTopics = () => {
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
  };

  return (
    <TopicsContext.Provider value={topicsArray}>
      <TopicsUpdateContext.Provider value={getTopics}>      
       {children}
      </TopicsUpdateContext.Provider>
    </TopicsContext.Provider>
  )
}

export { TopicsProvider, useTopicsContext, useTopicsContextUpdate }