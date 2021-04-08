import * as React from 'react';
import { useState, useContext, FC, createContext, useEffect } from 'react';
import { useBackdropUpdateContext } from './BackDropContext'

const ErrorContext = createContext(null);
const ErrorUpdateContext = createContext(null);

const useErrorContext = () => {
  return useContext(ErrorContext)
}

const useErrorUpdateContext = () => {
  return useContext(ErrorUpdateContext)
}

const ErrorProvider: FC = ({ children }) => {

  const [error, changeError] = useState([]);

  const backdropUpdate = useBackdropUpdateContext()

  useEffect(() => {
    backdropUpdate.handleClose()
  }, [error])
  
  const handleFailFast = (input: {
    message: string,
    topic: string,
    retries: number
  }) => {
    const { message, topic, retries } = input
    if (!topic || !message) return;

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

  const handleDLQ = (input: {
    message: string,
    topic: string,
    retries: number,
    faults: number
  }) => {
    console.log(input)
    const { message, topic, retries, faults } = input   
    if (!topic || !message) return;

    fetch('/strategy/dlq', {
      method: 'POST',
      headers: { 'Content-Type': 'Application/JSON' },
      body: JSON.stringify({ topic, message, retries, faults })
    })
      .then(data => data.json())
      .then(clients => {
        const { producer, consumer } = clients;
        // const errors = []
        consumer.connect()
          .then(consumer.subscribe())
          .then(consumer.run({
            eachMessage: ({topic, partitions, message}) => {
              console.log(message.value.toString())
            }
          }))
      })

  };
  const handleIgnore = (e: { preventDefault: () => void; }) => {
    e.preventDefault()
  };
  
  return (
    <ErrorContext.Provider value={error}>
      <ErrorUpdateContext.Provider 
        value={
          {
            handleFailFast: handleFailFast,
            handleDLQ: handleDLQ,
            handleIgnore: handleIgnore
          }
      }>
        {children}
      </ErrorUpdateContext.Provider>
    </ErrorContext.Provider>
  )
}

export { ErrorProvider, useErrorContext, useErrorUpdateContext}