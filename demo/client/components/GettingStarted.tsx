import React, { FC } from 'react';
import {
  Container, Typography, Divider,
} from '@material-ui/core';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { materialLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

const GettingStarted: FC = () => {
  const installCode = 'npm install kafka-penguin';
  return (
    <Container>
      <Typography variant="h3" color="textPrimary" align="center" gutterBottom>
        GETTING STARTED
      </Typography>

      <Divider variant="middle" />
      <SyntaxHighlighter
        language="javascript"
        style={materialLight}
      >
        { installCode }
      </SyntaxHighlighter>
    </Container>
  );
};

export default GettingStarted;
