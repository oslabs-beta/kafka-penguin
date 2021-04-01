//Documentation.
import * as React from 'react'
import { FC } from 'react'


 const DocumentationPage: FC = () => (
    <div>
       <h1 className="title is-1">Kafka-Penguin</h1>
       <p>
       Kafka-Penguin is an easy-to-use, light weight KafkaJS library for message processing.
       It provides developers with a single strategy for handling message processing failures 
       by failing fast.
       </p>

       <p>
       Accelerated by OS Labs and developed by Ziyad El Baz, Kushal Talele, Timeo Williams and Ausar English.
       </p>

       <p>WIP: This project is not ready for use as of yet</p>
       {"\n"}
       <h1 className="title is-1">Getting Started</h1>
       {"\n"}
       <p>
       Install kafka-penguin as an npm module and save it to your package.json file as a development dependency:   
       </p>
       {"\n"}
       <button> npm install kafka-penguin </button>
       {"\n"}
        <p>
         Once installed it can now be referenced by simply calling  <button> require('kafka-penguin'); </button>
        </p>
      </div>
  );
  
  export default DocumentationPage