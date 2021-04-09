# Home

    ![license](https://img.shields.io/github/license/oslabs-beta/kafka-penguin?color=%2357d3af) ![issues](https://img.shields.io/github/issues-raw/oslabs-beta/kafka-penguin?color=yellow) ![last commit](https://img.shields.io/github/last-commit/oslabs-beta/kafka-penguin?color=%2357d3af)[![npm version](https://img.shields.io/npm/v/kafka-penguin?color=%2344cc11&label=stable)](https://www.npmjs.com/package/kafka-penguin)

### About

Kafka-Penguin is an easy-to-use, lightweight KafkaJS plugin for message re-processing. It provides developers with two strategies for setting up message re-processing: FailFast and Dead Letter Queue.

The package allows developers to build event-driven applications with dedicated 'fail strategies' modeled after best practices in the field. This in turn allows developers to effectively address bugs in development and deploy more fault-tolerant systems in production. 

This package is meant to work in conjunction with with KafkaJS. For more information on KafkaJS, check out [Getting Started with KafkaJS](https://kafka.js.org/docs/getting-started).

### Getting Started 

Install Kafka-Penguin as an npm module and save it to your package.json file as a dependency:

```bash
npm install kafka-penguin
```

Once installed it can now be referenced by simply calling `require('kafka-penguin');`

### Example

All Kafka-Penguin needs is a KafkaJS client to run. Start by passing the client for your preferred strategy and Kafka-Penguin will create bespoke consumers, producers, and admins with built-in functionality to execute the chosen strategy. On the surface, you implement your application exactly as you would with KafkaJS.

```javascript
import { FailFast } from 'kafka-penguin'
const exampleClient = require('./clientConfig.ts')

// Set up the preferred strategy with a configured KafkaJS client
const exampleStrategy = new FailFast(2, exampleClient)

// Initialize a producer or consumer from the instance of the strategy
const producer = exampleStrategy.producer();

const message = {
  topic: 'wrong-topic',
  messages: [
    {
      key: 'hello',
      value: 'world',
    }
  ]
}

// Connect, Subscribe, Send, or Run virtually the same as with KafkaJS
producer.connect()
  .then(() => console.log('Connected!'))
  // The chosen strategy executes under the hood, like in this send method
  .then(() => producer.send(message))
  .catch((e: any) => console.log('error: ', e.message))
```

## Strategies/Documentation

[FailFast  ](strategies/readme/strategies-readme-fail-fast.md)

[Dead Letter Queue](strategies/readme/strategies-readme-dlq.md)

## **Contributors**

[Ausar English](https://www.linkedin.com/in/ausarenglish) [@ausarenglish](https://github.com/ausarenglish)

[Kushal Talele](https://www.linkedin.com/in/kushal-talele-29040820b/) [@ktrane1](https://github.com/ktrane1)

[Timeo Williams](https://www.linkedin.com/in/timeowilliams/) [@timeowilliams](https://github.com/timeowilliams)

[Ziyad El Baz](https://www.linkedin.com/in/ziyadelbaz) [@zelbaz946](https://github.com/zelbaz946)

### License

This product is licensed under the Apache License - see the [LICENSE.md](https://github.com/oslabs-beta/kafka-penguin/blob/main/LICENSE) file for details.

This is an open source product. We are not affiliated nor endorsed by either the Apache Software Foundation or KafkaJS. 

This product is accelerated by [OS Labs](https://opensourcelabs.io/).

