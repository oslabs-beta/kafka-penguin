import * as React from 'react';
import { FC } from 'react';
import {
  createStyles, makeStyles, Typography, Container,
} from '@material-ui/core';
import { Element } from 'react-scroll';
import MainContainer from './containers/MainContainer';
import { BackdropProvider } from './context/BackDropContext';
import GlobalNavBar from './components/GlobalNavBar';
import LandingBody from './components/LandingBody';
import TeamContainer from './containers/TeamContainer';
import GettingStarted from './components/GettingStarted';
import ParticlesBackdrop from './components/ParticlesBackdrop';

const useStyles = makeStyles(() => createStyles({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'column',
  },
  titleBox: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: '30vh',
    paddingBottom: '15vh',
  },
  segment: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: '5vh',
    paddingBottom: '5vh',
  },
}));

const App: FC = () => {
  const classes = useStyles();
  return (
    <>
      <Container className={classes.container} maxWidth="lg">
        <GlobalNavBar />
        <ParticlesBackdrop />
        <Container className={classes.titleBox} component={Element} name="top">
          <Typography
            variant="h1"
            align="center"
            color="textPrimary"
            gutterBottom
          >
            kafka-penguin
          </Typography>
          <img alt="mainLogo" style={{ height: '30vh', paddingBottom: '5vh' }} src="/assets/penguinCompressed.svg" />
          <Typography
            variant="h6"
            align="center"
            color="textSecondary"
            gutterBottom
          >
            ERROR HANDLING LIBRARY FOR KAFKAJS
          </Typography>
        </Container>
        <Container className={classes.segment} component={Element} name="features">
          <LandingBody />
        </Container>
        <BackdropProvider>
          <Container className={classes.segment} component={Element} name="demo">
            <MainContainer />
          </Container>
        </BackdropProvider>
        <Container className={classes.segment} component={Element} name="getting started">
          <GettingStarted />
        </Container>
        <Container className={classes.segment} component={Element} name="team">
          <TeamContainer />
        </Container>
      </Container>
    </>
  );
};

export default App;
