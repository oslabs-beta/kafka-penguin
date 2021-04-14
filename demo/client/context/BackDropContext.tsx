import * as React from 'react';
import { useState, useContext, FC, createContext } from 'react';

const BackdropContext = createContext(null)
const BackdropUpdateContext = createContext(null)

const useBackdropContext = () => {
  return useContext(BackdropContext)
}

const useBackdropUpdateContext = () => {
  return useContext(BackdropUpdateContext)
}

const BackdropProvider: FC = ({ children }) => {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <BackdropContext.Provider value={open}>
      <BackdropUpdateContext.Provider 
        value={
          {
            handleClose: handleClose,
            handleToggle: handleToggle
          }
        }>
        {children}
      </BackdropUpdateContext.Provider>
    </BackdropContext.Provider>
  )
}

export { BackdropProvider, useBackdropContext, useBackdropUpdateContext }