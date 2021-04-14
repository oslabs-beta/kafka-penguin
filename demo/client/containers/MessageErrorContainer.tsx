import * as React from 'react';
import { FC } from 'react';
import Error from '../components/Error'
import Message from '../components/Message'
import { useErrorContext } from '../context/ErrorContext'
import {Container, Typography, Theme, Paper, createStyles, makeStyles} from '@material-ui/core';

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
      justifyContent: 'flex-start',
      paddingTop: '3vh',
      // minWidth: '10vw'
    },
    containerHorizontal: {
      display: 'flex',
      justifyContent:'center',
      flexGrow: 1
      // flexWrap: 'wrap'
    }
  })
)

const MessageErrorContainer: FC = () => {
  const classes = useStyles();
  const updateError = useErrorContext();
  
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
          color='textPrimary'
          gutterBottom
        >Publish
        </Typography>
        <Message 
        />
      </Container>
      <Container className={classes.containerVertical}>
        <Typography 
          variant='h5' 
          align='center'
          color='textPrimary'
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