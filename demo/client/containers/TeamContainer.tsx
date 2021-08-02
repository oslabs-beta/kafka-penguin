import React, { FC } from 'react';
import {
  makeStyles, createStyles, Container, Divider, Typography,
} from '@material-ui/core';
import TeamMember from '../components/TeamMember';

const TeamContainer: FC = () => {
  const useStyles = makeStyles(() => createStyles({
    containerHorizontal: {
      // height: '80vh',
      paddingTop: '10vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      alignContent: 'center',
      justifyContent: 'center',
    },
    containerVertical: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',

    },
  }));
  const timeo = {
    name: 'Timeo Williams',
    linkedIn: 'https://www.linkedin.com/in/timeowilliams/',
    github: 'https://github.com/timeowilliams',
    photo: '/assets/timeo.jpeg',
  };
  const ausar = {
    name: 'Ausar English',
    linkedIn: 'https://www.linkedin.com/in/ausarenglish/',
    github: 'https://github.com/ausarenglish',
    photo: '/assets/ausar.jpeg',
  };
  const ziyad = {
    name: 'Ziyad Elbaz',
    linkedIn: 'https://www.linkedin.com/in/ziyadelbaz/',
    github: 'https://github.com/zelbaz946',
    photo: '/assets/ziyad.jpeg',
  };
  const kushal = {
    name: 'Kushal Talele',
    linkedIn: 'https://www.linkedin.com/in/kushaltalele/',
    github: 'https://github.com/ktrane1',
    photo: '/assets/kushal.jpeg',
  };

  const classes = useStyles();

  return (
    <Container>
      <Typography variant="h3" color="textPrimary" align="center" gutterBottom>
        TEAM
      </Typography>
      <Divider variant="middle" />
      <Container className={classes.containerHorizontal}>
        <Container className={classes.containerVertical}>
          <TeamMember details={timeo} />
          <TeamMember details={ausar} />
        </Container>
        <Container className={classes.containerVertical}>
          <TeamMember details={ziyad} />
          <TeamMember details={kushal} />
        </Container>
      </Container>
    </Container>
  );
};

export default TeamContainer;
