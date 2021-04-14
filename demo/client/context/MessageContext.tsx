import * as React from 'react';
import {
  useState, useContext, FC, createContext,
} from 'react';

const MessageContext = createContext(null);
const MessageUpdateContext = createContext(null);

const useMessageContext = () => useContext(MessageContext);

const useMesageUpdateContext = () => useContext(MessageUpdateContext);

interface Props {
  children: any
}

const MessageProvider: FC<Props> = ({ children } : Props) => {
  const [message, changeMessage] = useState('');
  const [topic, changeTopic] = useState('');
  const [retries, changeRetries] = useState(2);
  const [faults, changeFaults] = useState(2);

  return (
    <MessageContext.Provider
      value={
        {
          message,
          topic,
          retries,
          faults,
        }
      }
    >
      <MessageUpdateContext.Provider
        value={
          {
            changeMessage,
            changeTopic,
            changeRetries,
            changeFaults,
          }
        }
      >
        {children}
      </MessageUpdateContext.Provider>
    </MessageContext.Provider>
  );
};

export { MessageProvider, useMessageContext, useMesageUpdateContext };
