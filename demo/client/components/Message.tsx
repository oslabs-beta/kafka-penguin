import * as React from 'react';
import { FC } from 'react';
import {
  Typography, TextField, makeStyles, createStyles, Slider,
} from '@material-ui/core';
import { useMesageUpdateContext } from '../context/MessageContext';

const useStyles = makeStyles(() => createStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    '& .MuiTextField-root': {
      // margin: theme.spacing(1),
      width: '25vw',
      minWidth: '20vw',
      marginTop: '0',
    },
  },
  textfield: {
    paddingBottom: '1rem',
  },
}));

const Message: FC = () => {
  const classes = useStyles();
  const messageUpdate = useMesageUpdateContext();
  return (
    <form
      className={classes.root}
      noValidate
      autoComplete="off"
    >
      <TextField
        className={classes.textfield}
        id="outlined-multiline-static"
        label="Topic"
        multiline
        rows={1}
        variant="outlined"
        onChange={(event) => {
          messageUpdate.changeTopic(event.target.value);
        }}
      />
      <TextField
        className={classes.textfield}
        id="outlined-multiline-static"
        label="Message"
        multiline
        rows={5}
        variant="outlined"
        onChange={(event) => {
          messageUpdate.changeMessage(event.target.value);
        }}
      />
      <Slider
        defaultValue={2}
        onChange={(event, value: number) => {
          messageUpdate.changeRetries(value);
        }}
        aria-labelledby="discrete-slider"
        valueLabelDisplay="auto"
        step={1}
        marks
        min={1}
        max={5}
      />
      <Typography
        variant="button"
        color="textSecondary"
        align="center"
        gutterBottom
      >
        Set retries / Repeats
      </Typography>
      <Slider
        defaultValue={2}
        onChange={(event, value: number) => {
          messageUpdate.changeFaults(value);
        }}
        aria-labelledby="discrete-slider"
        valueLabelDisplay="auto"
        step={1}
        marks
        min={1}
        max={5}
      />
      <Typography
        variant="button"
        color="textSecondary"
        align="center"
        gutterBottom
      >
        Faults for DLQ and Ignore
      </Typography>
    </form>
  );
};

export default Message;
