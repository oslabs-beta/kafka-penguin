import * as React from 'react';
import { createStyles, makeStyles, Container } from '@material-ui/core';
import Topic from '../components/Topic';

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',

    },
  })
);

type Props = {
    topicsInfo: Array<{
      name: string,
      partitions: number
    }>
};

const TopicsContainer: React.FC<Props> = ({topicsInfo}: Props) => {

  const topicsMapped = topicsInfo.map((topicInfo, i) => {
    return <Topic key={i} topicInfo={topicInfo} />
  })

  const classes = useStyles();

  return (  
    <Container className = {classes.container}>
      {topicsMapped}
    </Container>
   
  )
}

export default TopicsContainer;