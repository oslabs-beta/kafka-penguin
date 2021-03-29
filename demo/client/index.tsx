import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter} from 'react-router-dom';
import App from './App';
import { ThemeProvider } from '@material-ui/core/styles'
import theme from './theme'

ReactDOM.render(
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </BrowserRouter>,
  document.getElementById('root')
);

