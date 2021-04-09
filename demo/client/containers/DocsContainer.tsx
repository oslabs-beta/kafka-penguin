import * as React from 'react';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import { makeStyles, createStyles, Container, Button, Theme } from '@material-ui/core';

const DocsContainer: FC = () => {
    return (
        <Container>
  
        <h3 id="getting-started">Getting Started</h3>
        <p>Install kafka-penguin as an npm module and save it to your package.json file as a development dependency:</p>
        <pre><code className="lang-bash">npm <span className="hljs-keyword">install</span> kafka-penguin
        </code></pre>
        <p>Once installed it can now be referenced by simply calling <code>require(&#39;kafka-penguin&#39;);</code></p>
        <h3 id="example">Example</h3>
        <p>Kafka-penguin works with any Kafka client, here is an example with the client exported from another file:</p>
        <pre><code className="lang-javascript"><span className="hljs-comment">//Import your kafkajs client from another file</span> <br></br>
        <span className="hljs-keyword">const</span> kafkaPenguin = <span className="hljs-built_in">require</span>(<span className="hljs-string">'kafka-penguin'</span>); <br></br>
        <span className="hljs-keyword">const</span> devClient = <span className="hljs-built_in">require</span>(<span className="hljs-string">'./clientConfig.js'</span>)<br></br>

        <span className="hljs-keyword">const</span> strategies = kafkaPenguin.failfast <br></br>
        <br></br> <span className="hljs-comment">// Initialize strategy-- passing in the # of retries and your kafkjs client</span> <br></br>
        <span className="hljs-keyword">const</span> newStrategy = <span className="hljs-keyword">new</span> strategies.FailFast(<span className="hljs-number">2</span>, devClient) 

        <span className="hljs-comment">//Create a wrong topic message </span> <br></br>
        <span className="hljs-keyword">const</span> message = &#123;
          <span className="hljs-attr">topic</span>: <span className="hljs-string">'wrong-topic'</span>,
            <span className="hljs-attr">messages</span>: [
              &#123; <span className="hljs-attr">key</span>: <span className="hljs-string">"hello"</span>,
              <span className="hljs-attr">value</span>: <span className="hljs-string">"world"</span>,
              &#125;
            ]
            &#125;
            <br></br>
        <span className="hljs-comment">// Initialize producer from the failfast strategy</span><br></br>
        <span className="hljs-keyword">const</span> producer = newStrategy.producer(); <br></br>

        producer.connect() <br></br>
          .then(<span className="hljs-function"><span className="hljs-params">()</span> =&gt;</span> <span className="hljs-built_in">console</span>.log(<span className="hljs-string">'Connected!'</span>)) <br></br>
          .then(<span className="hljs-function"><span className="hljs-params">()</span> =&gt;</span> producer.send(message)) <br></br>
          .catch(<span className="hljs-function">(<span className="hljs-params">e: any</span>) =&gt;</span> <span className="hljs-built_in">console</span>.log(<span className="hljs-string">"error: "</span>, e.message))
        </code></pre>
        <h3 id="api">API</h3>
        <p>You may use any of the kafka-penguin methods:</p>
        <h4 id="-failfast-retry-kafka-client-">.FailFast(retry, Kafka-client)</h4>
        <p><code>retry</code>: Pass in the number of retries, which will be used to retry connections and API calls to Kafka (when using producers or consumers).</p>
        <p><code>Kafka-client</code> : Pass in the configured KafkaJS client w/ specified brokers, username, and password.  </p>
        </Container>
    )
  }
  
export default DocsContainer;