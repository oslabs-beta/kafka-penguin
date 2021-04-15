# Ignore

## About

This strategy enables you to continuously process messages even if some messages are erroneous, problematic, or fail for some reason. It is meant to keep flows from producers or consumers unblocked even if there are failures.  Potential use cases for this strategy include services and systems that rely upon a constant stream of data.

## Syntax

**Ignore\(kafka-client, topic, callback\)**

`kafka-client` A configured  [KafkaJS client](https://kafka.js.org/docs/configuration) provided by the developer.

`topic` The target topic that producers or consumers will publish or subscribe to in this strategy instance. Kafka-Penguin currently supports one topic per strategy instance. 

`callback` A callback that must return a boolean value. The callback will take in one argument: the messages received by the consumer. During execution, the strategy will pass to the callback each message consumed; Even if a message which returns `false`, the producer or consumer will continue to produce or consume messages uninterrupted.  

#### **Producer**

`Ignore.producer` Returns a producer initialized from the strategy instance. The producer has "adapted" methods which execute the strategy under the hood. 

`producer.connect`  Connects the producer to the Kafka cluster indicated in the configured KafkaJS client. 

`producer.send(message)` This method takes in one argument, `messages` that are passed in with the same requirements as the counterpart method on KafkaJS, and sends it to the Kafka cluster. 

#### Consumer

`Ignore.consumer` Returns a consumer initialized from the strategy instance. The consumer has "adapted" methods which execute the strategy under the hood. 

`consumer.connect`  Connects the consumer to the Kafka cluster indicated in the configured KafkaJS client. 

`consumer.run` Starts consuming messages from the Kafka cluster to the consumer client. The `run` method also utilizes `eachMessage`to pass each message received through the callback provided at strategy instantiation. 

## Example

#### Producer:

```text
/* eslint-disable no-console */
import { Ignore } from './kafka-penguin/src/index'

const producerClientIgnore = require('./clientConfig.ts');

// This example simulates an error where the producer sends to a bad topic
const topicGood = 'test-topic';
const topicBad = 'topic-non-existent';

// Set up the Ignore strategy
// Configure it with a configured KafkaJS client, a topic, and a callback that returns boolean
const exampleIgnoreProducer = new Ignore(producerClientIgnore, topicGood, true);

// Initialize a producer from the new instance of the Ignore strategy
const producerIgnore = exampleIgnoreProducer.producer();

// Connecting the producer and send messages.
// If an error occurs with a message, the strategy ignores erroneous message and continues
// publishing good messages to the topic
producerIgnore.connect()
  .then(() => producerIgnore.send({
    topic: topicGood,
    messages: [
      {
        key: 'message 1',
        value: JSON.stringify('Good Message'),
      },
    ],
  }))
  .then(() => producerIgnore.send({
    topic: topicGood,
    messages: [
      {
        key: 'message 2',
        value: 'Bad Message',
      },
    ],
  }))
  .then(() => producerIgnore.send({
    topic: topicGood,
    messages: [
      {
        key: 'message 3',
        value: JSON.stringify('Good Message'),
      },
    ],
  }))
  .then(() => producerIgnore.disconnect())
  .catch((e: any) => {
    console.log(e);
  });
```

#### Consumer:

```text
/* eslint-disable no-console */
import { Ignore } from './kafka-penguin/src/index';

const client = require('./clientConfig.ts');
const topic = 'test-topic';

// This allows the consumer to evaluate each message according to a condition
// The callback must return a boolean value
const callback = (message) => {
  try {
    JSON.parse(message.value);
  } catch (e) {
    return false;
  }
  return true;
};

// Set up the Ignore strategy
// with a configured KafkaJS client, a topic, and the evaluating callback
const exampleIgnoreConsumer = new Ignore(client, topic, callback);

// Initialize a consumer from the new instance of the Dead Letter Queue strategy
const consumerIgnore = exampleIgnoreConsumer.consumer({ groupId: 'testID' });

// Connecting the consumer to consume messages. bad messages
// If the callback evaluates a message as erroneous by returning false, the strategy
// enables the consumer to keep consuming good messages from the topic
consumerIgnore.connect()
  .then(consumerIgnore.subscribe())
  .then(() => consumerIgnore.run({
    eachMessage: ({ message }) => {
    //   if (message.value.length < 5) return true;
    //   return false;
    console.log("message value:", message.value.toString())
    },
  }))
  .catch((e) => console.log(`Error message from consumer: ${e}`));
```

