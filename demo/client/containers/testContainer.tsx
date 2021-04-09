import * as React from 'react';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import Prism from 'prismjs';
import { makeStyles, createStyles, Container, Button, Theme } from '@material-ui/core';

// The code snippet you want to highlight, as a string
const code = `var data = 1;`;

// Returns a highlighted HTML string
const html = Prism.highlight(code, Prism.languages.javascript, 'javascript');

const DocsContainer: FC = () => {
    return (
        <Container>
           <h3>Getting Started</h3>
          <p>
          Install kafka-penguin as an npm module and save it to your package.json file
           as a development dependency:
           <pre>
             <code classNameName = "language-javascript">
             npm install kafka-penguin
             </code>
           </pre>

          Once installed it can now be referenced by simply calling <code>require('kafka-penguin');</code> 
          </p>
          <h3>Example</h3>
          <p>Kafka-penguin works with any Kafka client,
         here is an example with the client exported from another file:
         </p>
             <pre>
                <code classNameName = "language-javascript">
                const kafkaPenguin = require('kafka-penguin'); 
                <br></br>
                const devClient = require('./clientConfig.js')
                <br></br>
                const strategies = kafkaPenguin.failfast
                <br></br>
                // Initialize strategy-- passing in the # of retries and your kafkjs client
                <br></br>
                const newStrategy = new strategies.FailFast(2, devClient)
                <br></br>
                //Create a wrong topic message 
                <br></br>
                const message = &#123;
                <br></br>
                  topic: 'wrong-topic',
                  <br></br>
                    messages: [
                      &#123;key: "hello",
                      value: "world"
                      &#125;
                    ]
                    <br></br>
                    &#125;
                <br></br>
                // Initialize producer from the failfast strategy
                <br></br>
                const producer = newStrategy.producer();
                <br></br>
                producer.connect()
                <br></br>
                  .then(() => console.log('Connected!'))
                  <br></br>
                  .then(() => producer.send(message))
                  <br></br>
                  .catch((e: any) => console.log("error: ", e.message))
                </code>
            </pre>

        </Container>
    )
  }
  
export default DocsContainer;