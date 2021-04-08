# Readme

    ![license](https://img.shields.io/github/license/oslabs-beta/kafka-penguin?color=%2357d3af) ![issues](https://img.shields.io/github/issues-raw/oslabs-beta/kafka-penguin?color=yellow) ![last commit](https://img.shields.io/github/last-commit/oslabs-beta/kafka-penguin?color=%2357d3af) [![Repo stars](https://img.shields.io/github/stars/oslabs-beta/kafka-penguin?logoColor=%2334495e&style=social)](https://github.com/oslabs-beta/kafka-penguin/stargazers)

### About

Kafka-Penguin is an easy-to-use, lightweight KafkaJS library for message processing. It provides developers with a single strategy for handling message processing failures by failing fast.

#### For more information on KafkaJS, check out [Getting Started](https://kafka.js.org/docs/getting-started).

### Getting Started 

Install kafka-penguin as an npm module and save it to your package.json file as a development dependency:

```bash
npm install kafka-penguin
```

Once installed it can now be referenced by simply calling `require('kafka-penguin');`

### Example

Kafka-penguin works with any Kafka client, here is an example with the client exported from another file:

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

### API

You may use any of the kafka-penguin strategies and their associated methods:

#### FailFast

 Stop processing as soon as an error occurs. 

{% page-ref page="strategies-readme-fail-fast.md" %}

#### DLQ

Handle message processing failures by forwarding problematic messages to a dead-letter queue \(DLQ\).

{% page-ref page="strategies-readme-dlq.md" %}



#### .FailFast\(retry, Kafka-client\)

`retry`: Pass in the number of retries, which will be used to retry connections and API calls to Kafka \(when using producers or consumers\).

`Kafka-client` : Pass in the configured KafkaJS client w/ specified brokers, username, and password.

#### 

## **Contributors**

[Ausar English](https://www.linkedin.com/in/ausarenglish) [@ausarenglish](https://github.com/ausarenglish)

Kushal Talele [@ktrane1](https://github.com/ktrane1)

[Timeo Williams](https://www.linkedin.com/in/timeowilliams/) [@timeowilliams](https://github.com/timeowilliams)

[Ziyad El Baz](https://www.linkedin.com/in/ziyadelbaz) [@zelbaz946](https://github.com/zelbaz946)

### License

This project is licensed under the Apache License - see the [LICENSE.md](https://github.com/oslabs-beta/kafka-penguin/blob/main/LICENSE) file for details.

