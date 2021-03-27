import * as React from 'react';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';

type Props = {
    topicName: string,
    key: number
}

const Topic = ({topicName, key}: Props) => {
  return(
    <ListItem key={key}>
      <ListItemText primary={topicName}/>
    </ListItem>
  )
}

export default Topic;