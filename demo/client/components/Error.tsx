import * as React from 'react';
import { FC } from 'react';
import { createStyles, makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles(() => createStyles({
  root: {
    padding: '0em 1em 1em 1em',
    height: 'auto',
  },
}));

type Props = {
    errorMessage: string,
}

const Error: FC<Props> = ({ errorMessage }: Props) => {
  const classes = useStyles();
  return (
    <Typography className={classes.root} variant="body2">
      {errorMessage}
    </Typography>
  );
};

export default Error;
