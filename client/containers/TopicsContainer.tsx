import * as React from 'react';
import { useState, useEffect } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Topic from '../components/Topic';


// const useStyles = makeStyles((theme: Theme) => 
//   createStyles({
//     root: {
//       width: '100%',
//       maxWidth: 360,
//       theme: theme.palette.background.paper,
//       backgroundColor: theme.palette.background.default,
//       container :{
//         display:'flex',
//         justifyContent:'center',
//         alignItems: 'center'
//       },
//       display:'flex',
//       justifyContent:'center',
//       alignItems: 'center'
//     }
//   })
// );

type Props = {
    topicsInfo: Array
}

const TopicsContainer = ({topicsInfo}: Props) => {
  const topicsMapped = topicsInfo.map((topicName, i) => {
    return <Topic key={i} topicName={topicName} />
  })

  // const classes = useStyles();
  
  return (
    <div>
      <List component="nav">
        {topicsMapped}
      </List>
    </div>
  )

}

export default TopicsContainer;