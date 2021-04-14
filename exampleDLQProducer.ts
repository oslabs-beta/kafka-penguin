/* eslint-disable no-console */
import { DeadLetterQueue } from './index';

const producerClientDLQ = require('./clientConfig.ts');

// This example simulates an error where the producer sends to a bad topic
const topicGood = 'test-topic-DLQ';
const topicBad = 'topic-non-existent';

// Set up the Dead Letter Queue (DLQ) strategy
// Configure it with a configured KafkaJS client, a topic, and a callback that returns boolean
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
  .then(() => producerDLQ.send({
    topic: topicBad,
    messages: [
      {
        key: 'message 2',
        value: 'Bad Message',
      },
    ],
  }))
  .then(() => producerDLQ.send({
    topic: topicGood,
    messages: [
      {
        key: 'message 3',
        value: 'Good Message',
      },
    ],
  }))
  .then(() => producerDLQ.disconnect())
  .catch((e: any) => {
    console.log(e);
  });
