---
description: Strategy to stop processing as soon as an error occurs.
---

# FailFast README

## Usage:

#### .FailFast\(retry, Kafka-client\)

`retry`: Pass in the number of retries, which will be used to retry connections and API calls to Kafka \(when using producers or consumers\).

`Kafka-client` : Pass in the configured KafkaJS client w/ specified brokers, username, and password.

## Example:

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

\`\`

