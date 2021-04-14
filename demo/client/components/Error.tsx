import * as React from 'react';
import { FC } from 'react';
import { createStyles, makeStyles } from '@material-ui/core';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles(() => 
  createStyles({
    root: {
      padding: '0em 1em 1em 1em'
    }
  })
)

type Props = {
    errorMessage: string,
}

const Error: FC<Props> = ({errorMessage}: Props) => {
  const classes = useStyles();
  return (
    <Typography className={classes.root} variant='body2'>
      {errorMessage}
    </Typography>
  )
}


export default Error