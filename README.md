
## Kafka-Penguin
<p align="center"><img src="./demo/client/assets/penguin.svg" width='500' style="margin-top: 10px; margin-bottom: -10px;"></p>

### About

Kafka-Penguin is an easy-to-use, lightweight KafkaJS library for message processing. It provides developers with a single strategy for handling message processing failures by failing fast.  
  
For more information on KafkaJS, check out [Getting Started](https://kafka.js.org/docs/getting-started).
=======

Accelerated by [OS Labs](https://github.com/oslabs-beta/) and developed by [Ziyad El Baz](https://github.com/zelbaz946), [Kushal Talele](https://github.com/ktrane1), [Timeo Williams](https://github.com/timeowilliams), and [Ausar English](https://github.com/ausarenglish).

**WIP: This project is not ready for use as of yet**

### Getting Started

Install kafka-penguin as an npm module and save it to your package.json file as a development dependency:

```bash
npm install kafka-penguin
```

Once installed it can now be referenced by simply calling `require('kafka-penguin');`

### Example

Kafka-penguin works with any Kafka client, here is an example with the client exported from another file:

```javascript
const kafkaPenguin = require('kafka-penguin')
const devClient = require('./clientConfig.ts')

const strategies = kafkaPenguin.failfast
// Initialize strategy-- passing in your kafkjs client and # of retries

const newStrategy = new strategies.FailFast(2, devClient) 

const message = {
  topic: 'wrong-topic',
    messages: [
      {key: "hello",
       value: "world",
      }
    ]
}

// Initialize producer from strategy
const producer = newStrategy.producer();

producer.connect()
  .then(() => console.log('Connected!'))
  .then(() => producer.send(message))
  .catch((e: any) => console.log("error: ", e.message))
  
```


### API

You may use any of the kafka-penguin methods:

#### .FailFast\(retry, Kafka-client\)

`retry`: Pass in the number of retries, which will be used to retry connections and API calls to Kafka \(when using producers or consumers\).

`Kafka-client` : Pass in the configured KafkaJS client w/ specified brokers, username, and password.  


