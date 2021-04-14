import React, { FC } from 'react';
import {
  Container, createStyles, makeStyles, Typography, Divider,
} from '@material-ui/core';

const GettingStarted: FC = () => {
  return (
    <Container>
      <Typography variant="h3" color="textPrimary" align="center" gutterBottom>
        GETTING STARTED
      </Typography>
      <Divider variant='middle' />
    </Container> 
  )
};

export default GettingStarted;
