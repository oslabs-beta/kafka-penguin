import * as React from 'react';
import { FC } from 'react';
import { createStyles, makeStyles } from '@material-ui/core';
import {Container, Typography, TextField, Theme, Paper} from '@material-ui/core';
import Error from '../components/Error'
import Message from '../components/Message'

const useStyles = makeStyles((theme: Theme) => 
  createStyles({
    paper: {
      display: 'flex',
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    containerVertical: {
      display: 'flex',
      flexDirection: 'column',
      alignContent: 'center',
      justifyContent: 'flex-start'
    },
    containerHorizontal: {
      display: 'flex',
      justifyContent:'center',
      alignItems: 'center',
      alignContent:'center'
    }
  })
)

type Props = {
  changeMessage: (update: string) => void,
  changeTopic: (update: string) => void,
  changeRetries: (update: number) => void,
  updateError: Array<string>
}

const MessageErrorContainer: FC<Props> = ({changeMessage, changeTopic, updateError, changeRetries }: Props) => {
  const classes = useStyles();

  const errors = updateError.map((error: string, i: number) => {
    return (
      <Error key={i} errorMessage={error}/>
    )
  })
  return (
    <Container className={classes.containerHorizontal}>
      <Container className={classes.containerVertical}>
        <Typography 
          variant='h5' 
          align='center'
          gutterBottom
        >Publish
        </Typography>
        <Message 
          changeTopic={changeTopic} 
          changeMessage={changeMessage} 
          changeRetries={changeRetries} 
        />
      </Container>
      <Container className={classes.containerVertical}>
        <Typography 
          variant='h5' 
          align='center'
          gutterBottom
        >Log
        </Typography>
        <Paper   
          variant='outlined' 
          className={classes.paper}>
          <Typography 
            component={'div'} 
            variant='body2'>
            {errors}
          </Typography>
        </Paper>
      </Container>
    </Container>
  )
}

export default MessageErrorContainer