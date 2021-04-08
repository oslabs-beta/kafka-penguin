---
description: Strategy to stop processing as soon as an error occurs.
---

# FailFast README

## Usage:

#### FailFast\(retries, kafkaJS-client\)

`retries`: Number of times the producer attempts to send the message before disconnecting and throwing an error.

`kafkaJS-client` :  Passed-in [kafkaJS client](https://kafka.js.org/docs/configuration)  
  
  
  


## Example:

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
      key: 'hello',
	const message = {
  ]
}

// Fail Fast will attempt to send the message to the Kafka cluster.
// After the retry count is reached, the producer will automatically disconnect and an error is thrown.
producer.connect()
  .then(() => console.log('Connected!'))
  .then(() => producer.send(message))
```

