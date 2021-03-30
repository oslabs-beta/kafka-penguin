import * as React from 'react';
import { FC } from 'react';
import { createStyles, makeStyles, Button, Container } from '@material-ui/core';

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      alignContent: 'space-between',
    },
    button: {
      margin: '1rem 1rem 1rem 1rem'
    },
  })
);

type Props = {
  handleFailFast: (e: 
    {preventDefault: () => void}
  ) => void,
  handleDLQ: (e: 
    {preventDefault: () => void}
  ) => void,
  handleIgnore: (e: 
    {preventDefault: () => void}
  ) => void,
};

const StrategyContainer: FC<Props> = ({handleFailFast, handleDLQ, handleIgnore}: Props) => {
  //After the user clicks on the button FF or DLQ,
  //we will render the associated strategy data 
  //to them in a div below
  const classes = useStyles();
  return (
    <Container className={classes.container}>
      
      <Button
        className={classes.button}
        color='primary'
        variant='contained'
        onClick={handleFailFast}
      >
        FailFast
      </Button>
      <Button
        className={classes.button}
        color='primary'
        variant='contained'
        onClick={handleDLQ}
      >
        DLQ
      </Button>
      <Button
        className={classes.button}
        color='primary'
        variant='contained'
        onClick={handleIgnore}
      >
        Ignore
      </Button>
    </Container>
  )
}
export default StrategyContainer