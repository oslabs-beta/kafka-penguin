# FailFast

This strategy executes a purposeful disconnect after a producer has sent an erroneous message.  Potential use cases for this strategy include micro-services where there is a low tolerance for failure, as well as acid and/or transactional workflows. This strategy also works well for development environments in Agile-based workflows. 

## Syntax:

#### FailFast\(retries, kafka-client\)

`retries` Number of times the producer attempts to send the message before disconnecting and throwing an error.

`kafka-client`  A configured  [KafkaJS client](https://kafka.js.org/docs/configuration) provided by the developer. 

**Producer**

`FailFast.producer` Returns a producer initialized from the strategy instance. The producer has "adapted" methods that execute the strategy under the hood. 

`producer.connect`  Connects the producer to the Kafka cluster indicated in the configured KafkaJS client. 

`producer.send(message)` This method takes in one argument, `message` that is passed in with the same requirements as the counterpart method on KafkaJS, and sends it to the Kafka cluster. However, this send will disconnect the producer once it's hit the set number of retries. 

## Example:

**FailFast**

```javascript
import { FailFast } from 'kafka-penguin'
const FailFastClient = require('./clientConfig.ts')

// Set up Fail Fast with the number of retried and a configured KafkaJS client
const exampleFailFast = new FailFast(2, FailFastClient)

// Initialize a producer from the new instance of Fail Fast
const producer = exampleFailFast.producer();


// Example error of a producer sending to a non-existent topic
const message = {
  topic: 'topic-non-existent',
  messages: [
    {
      key: 'hello'
  ]
}

// FailFast will attempt to send the message to the Kafka cluster.
// After the retry count is reached, the producer will automatically disconnect and an error is thrown.
producer.connect()
  .then(() => console.log('Connected!'))
  .then(() => producer.send(message))
```

