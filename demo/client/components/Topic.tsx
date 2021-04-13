import * as React from 'react';
import { FC } from 'react';
import { Card, CardContent, Typography, createStyles, makeStyles } from '@material-ui/core';

type Props = {
    topicInfo: {
      name: string,
      partitions: number
    },
    id: number,
}

const Topic: FC<Props> = ({topicInfo, id}: Props) => {

  const useStyles = makeStyles(() => 
    createStyles({
      root:  {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '1rem 1rem 1rem 1rem'
      },    
    })
  );

  const classes = useStyles();

  return(
    <Card key={id} className={classes.root} >
      <CardContent>
        <Typography variant='body2' align='center' noWrap={true}>
          {topicInfo.name}
        </Typography>
        <Typography variant='body2' color='textSecondary' noWrap={true}>
          {`partitions: ${topicInfo.partitions}`}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default Topic;