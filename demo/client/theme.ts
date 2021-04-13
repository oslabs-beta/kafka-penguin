import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  // spacing: factor => `${0.25 * factor}rem`,
  palette: {
    primary: {
      light: '#72cff8',
      main: '#4fc3f7',
      dark: '#3788ac',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff7961',
      main: '#f44336',
      dark: '#ba000d',
      contrastText: '#000',
    },
    background: {
      default: '#f4f4f4'
    },
  },
  typography: {
    fontSize: 14,
    fontFamily: [
      'Montserrat',
    ].join(','),
  },
});

export default theme