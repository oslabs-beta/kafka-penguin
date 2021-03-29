import * as React from 'react';
import { createStyles, makeStyles } from '@material-ui/core';
import {Typography} from '@material-ui/core';

const useStyles = makeStyles(() => 
  createStyles({
    root: {
      padding: '1em 1em 1em 1em'
    }
  })
)

type Props = {
    errorMessage: string,
}

const Error: React.FC<Props> = ({errorMessage}: Props) => {
  const classes = useStyles();
  return (
    <Typography className={classes.root} variant='body2'>
      {errorMessage}
    </Typography>
  )
}

export default Error