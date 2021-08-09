import * as React from 'react';
import { FC } from 'react';
import {
  createStyles, makeStyles, withStyles, AppBar, Toolbar, IconButton, Button, Icon,
} from '@material-ui/core';
import { Link } from 'react-scroll';
import { sizing } from '@material-ui/system';

const useStyles = makeStyles(() => createStyles({
  root: {
    width: '100vw',
    padding: 0,
    bottom: '0',
  },
  landingButtons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  logo: {
    alignSelf: 'flex-start',
  },
  button: {
    margin: '1rem 1rem 1rem 1rem',
  },
  toolbarStyle: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '70px',
  },
}));

const toolbarStyle = {
  minHeight: '200px',
};

const Footer: FC = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      {/* <GlobalCss /> */}
      {/* className={classes.toolbarStyle} */}
      <AppBar position="sticky" style={toolbarStyle}>
        <Toolbar
          className={classes.toolbarStyle}
       // style={classes.toolbarStyle}
        >
          <IconButton className={classes.button}>
            <Icon
              component={Link}
              to="top"
              activeClass="active"
              spy
              smooth
            >
              <img alt="navLogo" src="assets/penguinCompressed.svg" />
            </Icon>
          </IconButton>
          <Button
            className={classes.button}
            component={Link}
            to="features"
            activeClass="active"
            spy
            offset={-75}
            smooth
            color="inherit"
          >
            Features
          </Button>
          <Button
            className={classes.button}
            component={Link}
            to="demo"
            activeClass="active"
            spy
            offset={-75}
            smooth
            color="inherit"
          >
            Demo
          </Button>
          <Button
            className={classes.button}
            component={Link}
            to="getting started"
            activeClass="active"
            spy
            offset={-75}
            smooth
            color="inherit"
          >
            Getting Started
          </Button>
          <Button
            className={classes.button}
            component={Link}
            to="team"
            activeClass="active"
            spy
            offset={-75}
            smooth
            color="inherit"
          >
            Team
          </Button>
          {/* <Button
            className={classes.button}
            color="inherit"
            href="https://app.gitbook.com/@kafka-penguin-1/s/kafka-penguin/"
          >
            Docs
          </Button>
          <Button
            className={classes.button}
            color="inherit"
            href="https://github.com/oslabs-beta/kafka-penguin"
          >
            Github
          </Button> */}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Footer;
