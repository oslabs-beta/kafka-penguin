import * as React from 'react';
import { useState, useContext, FC, createContext } from 'react';

const MessageContext = createContext(null);
const MessageUpdateContext = createContext(null)

const useMessageContext = () => {
  return useContext(MessageContext)
}

const useMesageUpdateContext = () => {
  return useContext(MessageUpdateContext)
}

const MessageProvider: FC = ({ children }) => {

  const [message, changeMessage] = useState('');
  const [topic, changeTopic] = useState('')
  const [retries, changeRetries] = useState(2)
 
  return (
    <MessageContext.Provider 
      value={
        {
          message: message, 
          topic: topic, 
          retries: retries
        }
      }
    >
      <MessageUpdateContext.Provider 
        value={
          {
            changeMessage: changeMessage,
            changeTopic: changeTopic,
            changeRetries: changeRetries
          }
        }>
        {children}
      </MessageUpdateContext.Provider>
    </MessageContext.Provider>
  )
}

export { MessageProvider, useMessageContext, useMesageUpdateContext }