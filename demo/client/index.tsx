import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ThemeProvider } from '@material-ui/core/styles'
import theme from './theme'
import ParticlesBackdrop from './components/ParticlesBackdrop'

ReactDOM.render(
    <ThemeProvider theme={theme}>
      {/* <Documentation /> */}
      <App />
    </ThemeProvider>,
  document.getElementById('root')
);

