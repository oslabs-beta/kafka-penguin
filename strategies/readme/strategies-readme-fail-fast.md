---
description: >-
  The failfast strategy is a pattern to handle message reprocessing more
  efficiently. It enables the user to retry sending a failed message a
  predetermined number of times before disconnecting.
---

# FailFast README

This strategy allows developers the ability to debug more effectively and discover bugs faster in their message re-processing workflows. This, in turn, allows developers the opportunity to build more fault-tolerant systems.

## Syntax:

#### failfast\(retries, kafkaJS-client\)

`retries`: Number of times the producer attempts to send the message before disconnecting and throwing an error.

`kafkaJS-client` :  Passed-in [kafkaJS client](https://kafka.js.org/docs/configuration).  
  
failfast creates a producer method similiar to the [producer](https://kafka.js.org/docs/producing) method in kafkJS except for added functionality **w/ send.** 

**Exceptions include:**

* retries are specified to the number passed into the new failfast instance. 
* It will disconnect the producer once it's hit the set number of retries. 

The **send** method will send the inputted message for the set number of retries which is passed in when creating an instance of the failfast method.  
  
**send\(message\)**  
  
`message` :  A message sent from the producer that holds topic and message data. 

Ex: 

```javascript
  topic: 'topic-non-existent',
  messages: [
    {
      key: 'hello'
    }
  ]
```

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
      key: 'hello'
  ]
}

// Fail Fast will attempt to send the message to the Kafka cluster.
// After the retry count is reached, the producer will automatically disconnect and an error is thrown.
producer.connect()
  .then(() => console.log('Connected!'))
  .then(() => producer.send(message))
```

