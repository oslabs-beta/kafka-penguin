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
    topic: topicBad,
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
