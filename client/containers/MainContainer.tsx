import * as React from 'react';
import { useState, useEffect } from 'react';
// import { Switch, Route, Router, Link, useLocation } from 'react-router-dom';
// import { Button, TextField } from '@material-ui/core';
import TopicsContainer from './TopicsContainer';




type Props = {
    setRedirect: Function
}

const MainContainer = ({setRedirect}: Props) => {

  const [topicsArray, changeTopicsArray] = useState([]);

  useEffect(() => {     
    const getTopics = () => {  
      const userDetails = localStorage.getItem('userDetails')
      fetch('/topic/getTopics', {
        method: 'POST',
        headers: {'Content-Type': 'Application/JSON' },
        body: userDetails
      })
        .then(data => data.json())
        .then(data => {
          const topicData = data.topics.reduce((acc, cur) => {
            acc.push(cur.name)
            return acc
          }, [])
          changeTopicsArray(topicData)
        })   
    } 
    getTopics();  
  }, [])

  return(
    <div className = "MainContainer">
      <TopicsContainer topicsInfo={topicsArray} />
    </div>
  )
}





export default MainContainer;