import * as React from 'react'
import { FC } from 'react'
import { useMesageUpdateContext } from '../context/MessageContext'
import { Typography, TextField, makeStyles, createStyles, Theme, Slider } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) => 
  createStyles({
    root: {
      '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: '20em',
        marginTop: '0',
       
      },
    },
    textfield: {
       paddingBottom: '1rem'
    }
  })
)

const Message: FC = () => {
  const classes = useStyles()
  const messageUpdate = useMesageUpdateContext()
  return (
    <form className={classes.root} noValidate autoComplete="off">
      <TextField
        id="outlined-multiline-static"
        label="Topic"
        multiline
        rows={1} 
        variant="outlined"
        onChange={event => {
          messageUpdate.changeTopic(event.target.value)
        }}
      />
      <TextField
        id="outlined-multiline-static"
        label="Message"
        multiline
        rows={5}
        variant="outlined"
        onChange={event => {
          messageUpdate.changeMessage(event.target.value)
        }}
      />
      <Slider
        defaultValue={2}
        onChange={(event, value: number) => {
          messageUpdate.changeRetries(value)
        }}
        aria-labelledby="discrete-slider"
        valueLabelDisplay="auto"
        step={1}
        marks
        min={1}
        max={5}
      />
      <Typography 
        variant='body1' 
        color='textSecondary' 
        align='center'
        gutterBottom>
        Set retries
      </Typography>
    </form>
  )
}

export default Message