import * as React from 'react';
import { useState, FC } from 'react';
import TopicsContainer from './TopicsContainer';
import StrategyContainer from './StrategyContainer';
import MessageErrorContainer from './MessageErrorContainer'
import { TopicsProvider } from '../context/TopicContext'
import { MessageProvider } from '../context/MessageContext'
import { ErrorProvider } from '../context/ErrorContext'
import { useBackdropContext, useBackdropUpdateContext } from '../context/BackDropContext'
import { Container, createStyles, makeStyles, Backdrop, CircularProgress, Theme } from '@material-ui/core';

type Props = {
  setRedirect: (value: boolean) => void
};

const MainContainer: FC<Props> = ({ setRedirect }: Props) => {

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

  const classes = useStyles();
  const backdropContext = useBackdropContext()
  const backdropUpdate = useBackdropUpdateContext()

  return (
    <Container>
      <ErrorProvider>
       <MessageProvider>
        <MessageErrorContainer
          />
          <Container className={classes.container}>
            <StrategyContainer
            />        
          </Container>
        </MessageProvider>
      </ErrorProvider>
        <TopicsProvider>
          <Container className={classes.container}>
            <TopicsContainer />  
          </Container>
        </TopicsProvider>
      <Backdrop 
        className={classes.backdrop} 
        open={backdropContext} 
        onClick={backdropUpdate.handleClose}
      >
        <CircularProgress color='secondary' />
      </Backdrop>
    </Container>
  )
}

export { MainContainer };