---
description: >-
  Strategy to handle message processing failures by forwarding problematic
  messages to a dead-letter queue.
---

# Dead Letter Queue

This strategy creates another topic that acts as a repository for erroneous messages. It works side by side your normal topic and is meant to keep flows from producers or consumers unblocked \(while storing problematic messages for later reprocessing\).  Potential use cases for this strategy include services with data streaming, non-ACID or transactional message flows, or any system that simply needs to "just keep running". 

## Syntax:

**DeadLetterQueue\(kafka-client, topic, callback\)**

`kafka-client`  A configured KafkaJS client provided by the developer. 

`topic` The target topic that producers or consumers will publish or subscribe to in this strategy instance. Kafka-penguin currently supports one topic per strategy instance. If a dead letter queue for this topic has not been created, the strategy will automatically create it upon producer or consumer connect. 

`callback` A callback that must return a boolean value. The callback will take in one argument: the messages received by the consumer. During execution, the strategy will pass to the callback each message consumed; any message which returns false will be rerouted to the topic-specific dead letter queue. This allows the developer to customize the strategy to catch specific conditions when consuming. 

#### **Producer**

`DeadLetterQueue.producer` Returns a producer initialized from the strategy instance. The producer has "adapted" methods which execute the strategy under the hood. 

`producer.connect`  Connects the producer to the Kafka cluster indicated in the configured KafkaJS client. This method will also create a topic-specific dead letter queue if one does not already exist. 

`producer.send(message)` This method takes in one argument, `messages` that are passed in with the same requirements as the counterpart method on KafkaJS, and sends it to the Kafka cluster. However, this send is adapted to send to the strategy's dead letter queue upon error. 

#### Consumer

`DeadLetterQueue.consumer` Returns a consumer initialized from the strategy instance. The consumer has "adapted" methods which execute the strategy under the hood. 

`consumer.connect`  Connects the consumer to the Kafka cluster indicated in the configured KafkaJS client. This method will also create a topic-specific dead letter queue if one does not already exist. 

`consumer.run` Starts consuming messages from the Kafka cluster to the consumer client. The `run` method also utilizes `eachMessage`to pass each message received through the callback provided at strategy instantiation. If the callback returns false, the `run` method automatically creates a temporary producer, it produces the message to the dead letter queue, and then discards that producer. 

## Example: 

#### Producer

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

**Consumer**

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



