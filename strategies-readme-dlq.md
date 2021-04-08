---
description: >-
  Strategy to handle message processing failures by forwarding problematic
  messages to a dead-letter queue.
---

# Dead Letter Queue README

Dead Letter Queues are message queues that can be produced to when a message on another queue cannot be processed successfully. Dead Letter Queueus allow you to continue processing messages in a stream even if some messages cannot be processed. 

## Usage:

DLQ is a kafka-penguin module class that employs the dead letter queue strategy for the KakfaJS client. It's instantiated with three parameters:

#### new DLQ\(Kafka-client, topic, boolean\)

`Kafka-client` : Pass in the configured KafkaJS client w/ specified brokers, username, and password.

`topic`: Kakfa topic form which you wish to produce or consume.

`boolean`:  

DLQ contains two methods for a KafkaJS producer and consumer respectively-- .producer \( \) and .consumer\( \):

**.producer \(  \)** mimics the KafkaJs' built-in 'producer\( \)' method under the hood.

  Here is an example of employing DLQ for a producer: 

```javascript
const producerClientDLQ = require('./clientConfig.ts')
import { DeadLetterQueue } from 'kafka-penguin'


// This example simulates an error where the producer sends to a bad topic
const topicGood = 'test-topic-DLQ';
const topicBad = "topic-non-existent"

// Set up the Dead Letter Queue (DLQ) strategy with a configured KafkaJS client, a topic, and a callback that evaluates to a boolean
const exampleDLQProducer = new DeadLetterQueue(producerClientDLQ, topicGood, true);

// Initialize a producer from the new instance of the Dead Letter Queue strategy
const producerDLQ = exampleDLQProducer.producer();

// Connecting the producer creates a DLQ topic in case of bad messages
// If an error occurs, the strategy moves the message to the topic specific DLQ
// The producer is able to keep publishing good messages to the topic
producerDLQ.connect()
  .then(() => producerDLQ.send({
    topic: topicGood,
    messages: [
      {
        key: 'message 1',
        value: 'Good Message',
      },
    ],
  }))
  .then(() => producerDLQ.send ({
    topic: topicBad,
    messages: [
      {
        key: 'message 2',
        value: 'Bad Message',
      }
    ]
  }))
  .then(() => producerDLQ.send ({
    topic: topicGood,
    messages: [
      {
        key: 'message 3',
        value: 'Good Message',
      }
    ]
  })) 
  .then(() => producerDLQ.disconnect())
  .catch((e: any) => {
    console.log(e);


```

\*\*\*\*

**.consumer \(  \)** mimics the KafkaJs' built-in 'consumer\( \)' method under the hood.

Here is an example of employing DLQ for a consumer: 

```javascript
const client = require('./clientConfig.ts');
import { DeadLetterQueue } from 'kafka-penguin';

const topic = 'test-topic-DLQ';

// This allows the consumer to evaluate each message according to a condition
// The callback must return a boolean value
const callback = (message) => {
  try {
    JSON.parse(message.value);
	const callback = (message) => {
  return true;
};

// Set up the Dead Letter Queue (DLQ) strategy with a configured KafkaJS client, a topic, and the evaluating callback
const exampleDLQConsumer = new DeadLetterQueue(client, topic, callback);

// Initialize a consumer from the new instance of the Dead Letter Queue strategy
const consumerDLQ = exampleDLQConsumer.consumer({ groupId: 'testID' });



// Connecting the consumer creates a DLQ topic in case of bad messages
// If the callback returns false, the strategy moves the message to the topic specific DLQ
// The consumer is able to keep consuming good messages from the topic
consumerDLQ.connect()
  .then(consumerDLQ.subscribe())
  .then(() => consumerDLQ.run({
    eachMessage: ({ topic, partitions, message }) => {
      console.log(JSON.parse(message.value));
    },
  }))
  .catch((e) => console.log(`Error message from consumer: ${e}`));



```



\`\`



