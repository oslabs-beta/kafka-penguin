import * as React from 'react';
import { createStyles, makeStyles } from '@material-ui/core';
import {Container, Typography, TextField, Theme, Paper} from '@material-ui/core';
import Error from '../components/Error'

const useStyles = makeStyles((theme: Theme) => 
  createStyles({
    root: {
      '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: '20em',
      },
    },
    paper: {
      margin: theme.spacing(1),
      width: '30em',
      height: '20em',
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
  updateError: Array<string>
}

const MessageErrorContainer: React.FC<Props> = ({changeMessage, changeTopic, updateError}: Props) => {
  const classes = useStyles();

  const errors = updateError.map((error: string, i: number) => {
    return (
      <Error key={i} errorMessage={error} />
    )
  })
  return (
    <Container className={classes.containerHorizontal}>
      {/* <Grid container spacing ={3}>
        <Grid item sm={6}> */}
      <Container className={classes.containerVertical}>
        {/* <Typography variant="h6" color='textSecondary'>Test your cluster</Typography> */}
        <form className={classes.root} noValidate autoComplete="off">
          <TextField
            id="outlined-multiline-static"
            label="Topic"
            multiline
            rows={1} 
            variant="outlined"
            onChange={event => {
              changeTopic(event.target.value)
            }}
          />
          <TextField
            id="outlined-multiline-static"
            label="Message"
            multiline
            rows={5}
            variant="outlined"
            onChange={event => {
              changeMessage(event.target.value)
            }}
          />
        </form>
      </Container>
      <Container className={classes.containerVertical}>
        {/* </Grid>   
        <Grid item sm={6}> */}
        <Typography variant='h5' align='center'>
          Error log
        </Typography>
        <Paper variant='outlined' className={classes.paper}>
          <Typography variant='body2'>
            {errors}
          </Typography>
        </Paper>
 
      </Container>
      {/* </Grid>
      </Grid> */}
    </Container>
  )
}

export default MessageErrorContainer