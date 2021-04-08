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
	@@ -17,6 +19,8 @@ const message = {
  ]
}

// Fail Fast will attempt to send the message to the Kafka cluster.
// After the retry count is reached, the producer will automatically disconnect and an error is thrown.
producer.connect()
  .then(() => console.log('Connected!'))
  .then(() => producer.send(message))
```

\`\`

