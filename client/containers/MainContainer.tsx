import * as React from "react";
import { useState, useEffect } from 'react';
import { Switch, Route, Router, Link, useLocation } from 'react-router-dom';
import { Button, TextField } from '@material-ui/core';
import TopicsContainer from "./TopicsContainer";
import Topic from "../components/Topic"




type MainContainerProps = {
    setRedirect: Function
}

type topic = {
    topic: string
}

const MainContainer = ({setRedirect}:MainContainerProps) => {
    const [topicsArray, changeTopicsArray] = useState([]);
    // console.log('After invoking getTopics', topicsArray);
    useEffect(() => {     
        const getTopics = () => {  
            console.log('inside get topics')
            const userDetails = localStorage.getItem('userDetails')
             fetch('/topic/getTopics', {
                method: 'POST',
                headers: {"Content-Type": "Application/JSON" },
                body: userDetails
            })
              .then(data => data.json())
              .then(data => {
                  const topicData = data.topics.reduce((acc, cur) => {
                      acc.push(<Topic topic= {cur.name} />)
                      return acc
                  }, [])
                  changeTopicsArray(topicData)
              })   
            } 
          getTopics();  
    }, [])

    return(
        <div className = "MainContainer">
                  {topicsArray} 
        </div>
    )
}





export default MainContainer;