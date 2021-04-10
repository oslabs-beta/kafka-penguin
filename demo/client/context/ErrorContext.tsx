import * as React from 'react';
import { useState, useContext, FC, createContext, useEffect } from 'react';
import { useBackdropUpdateContext } from './BackDropContext';


const ErrorContext = createContext(null);
const ErrorUpdateContext = createContext(null);

const useErrorContext = () => {
  return useContext(ErrorContext);
};

const useErrorUpdateContext = () => {
  return useContext(ErrorUpdateContext);
};

const ErrorProvider: FC = ({ children }) => {
  const [error, changeError] = useState([]);

  const backdropUpdate = useBackdropUpdateContext();
  // UPDATE BACKDROP STATE
  useEffect(() => {
    backdropUpdate.handleClose();
  }, [error]);
  // FAILFAST POST REQUEST //
  const handleFailFast = (input: {
    message: string;
    topic: string;
    retries: number;
  }) => {
    const { message, topic, retries } = input;
    if (!topic || !message) return;

    fetch('/strategy/failfast', {
      method: 'POST',
      headers: { 'Content-Type': 'Application/JSON' },
      body: JSON.stringify({
        topic: topic,
        message: message,
        retries: retries,
      }),
    })
      .then(data => data.json())
      .then(errors => {
        changeError(errors);
      });
  };
  // DEAD LETTER QUEUE POST REQUEST //
  const handleDLQ = (input: {
    message: string;
    topic: string;
    retries: number;
    faults: number;
    }) => {
      const { message, topic, retries, faults } = input;
      if (!topic || !message || faults >= retries) return;

    fetch('/strategy/dlq', {
      method: 'POST',
      headers: { 'Content-Type': 'Application/JSON' },
      body: JSON.stringify({ topic, message, retries, faults }),
    })
      .then(res => res.json())
      .then(messages => {
        changeError(messages)
      })
      .catch(e => console.log(e));
  };

  const handleIgnore = (e: { preventDefault: () => void }) => {
    e.preventDefault();
  };

  return (
    <ErrorContext.Provider value={error}>
      <ErrorUpdateContext.Provider
        value={{
          handleFailFast: handleFailFast,
          handleDLQ: handleDLQ,
          handleIgnore: handleIgnore,
        }}
      >
        {children}
      </ErrorUpdateContext.Provider>
    </ErrorContext.Provider>
  );
};

export { ErrorProvider, useErrorContext, useErrorUpdateContext }
