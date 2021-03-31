---
description: Current standard
---

# Kafka-Penguin



## Kafka-Penguin

Kafka-Penguin is an easy-to-use, lightweight KafkaJS library for message processing. It provides developers with a single strategy for handling message processing failures by failing fast.  
  
For more information on KafkaJS, check out [Getting Started](https://kafka.js.org/docs/getting-started).

Accelerated by [OS Labs](https://github.com/oslabs-beta/) and developed by [Ziyad El Baz](https://github.com/zelbaz946), [Kushal Talele](https://github.com/ktrane1), [Timeo Williams](https://github.com/timeowilliams) and [Ausar English](https://github.com/ausarenglish).

**WIP: This project is not ready for use as of yet**

### Installation

Download `kafka-penguin` from npm in your terminal with :

```bash
npm install kafka-penguin
```

#### 

* [A Brief Intro to Kafka](https://kafka.js.org/docs/introduction)
* [Configuring KafkaJS](https://kafka.js.org/docs/configuration)
* [Example Producer](https://kafka.js.org/docs/producer-example)
* [Example Consumer](https://kafka.js.org/docs/consumer-example)

#### Configuring your client:

The example shown below is used w/ sasl. 

`clientConfig.js`

```javascript
const { Kafka } = require('kafkajs')
require('dotenv').config();

// Create the client with the broker list
const kafka = new Kafka({
  clientId: 'fail-fast-producer',
  brokers: [],
  ssl: true,
  sasl: {
    mechanism: 'plain',
    username: 'username',
    password: 'password',
  },
})

module.exports = kafka;
```

**Usage:**

`example.js`

```javascript
const kafkaPenguin = require('kafka-penguin')
//Import your kafkajs client from another file
const devClient = require('./clientConfig.js')

const strategies = penguinjs.failfast
// Initialize strategy-- passing in the # of retries and your kafkjs client
const newStrategy = new strategies.FailFast(2, devClient) 

//Create a wrong topic message 
const message = {
  topic: 'wrong-topic',
    messages: [
      {key: "hello",
       value: "world",
      }
    ]
}

// Initialize producer from the failfast strategy
const producer = newStrategy.producer();

producer.connect()
  .then(() => console.log('Connected!'))
  .then(() => producer.send(message))
  .catch((e: any) => console.log("error: ", e.message))
```





