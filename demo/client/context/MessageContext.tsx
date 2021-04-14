import * as React from 'react';
import {
  useState, useContext, FC, createContext,
} from 'react';

const MessageContext = createContext(null);
const MessageUpdateContext = createContext(null);

const useMessageContext = () => useContext(MessageContext);

const useMesageUpdateContext = () => useContext(MessageUpdateContext);

interface Props {
  children: FC
}

const MessageProvider: FC<Props> = ({ children } : Props) => {
  const [message, changeMessage] = useState('');
  const [topic, changeTopic] = useState('');
  const [retries, changeRetries] = useState(2);

  return (
    <MessageContext.Provider
      value={
        {
          message,
          topic,
          retries,
        }
      }
    >
      <MessageUpdateContext.Provider
        value={
          {
            changeMessage,
            changeTopic,
            changeRetries,
          }
        }
      >
        {children}
      </MessageUpdateContext.Provider>
    </MessageContext.Provider>
  );
};

export { MessageProvider, useMessageContext, useMesageUpdateContext };
