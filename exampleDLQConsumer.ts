/* eslint-disable no-console */
import { DeadLetterQueue } from 'kafka-penguin';

const client = require('./clientConfig.ts');

const topic = 'test-topic-DLQ';

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

// Set up the Dead Letter Queue (DLQ) strategy
// with a configured KafkaJS client, a topic, and the evaluating callback
const exampleDLQConsumer = new DeadLetterQueue(client, topic, callback);

// Initialize a consumer from the new instance of the Dead Letter Queue strategy
const consumerDLQ = exampleDLQConsumer.consumer({ groupId: 'testID' });

// Connecting the consumer creates a DLQ topic in case of bad messages
// If the callback returns false, the strategy moves the message to the topic specific DLQ
// The consumer is able to keep consuming good messages from the topic
consumerDLQ.connect()
  .then(consumerDLQ.subscribe())
  .then(() => consumerDLQ.run({
    eachMessage: ({ message }) => {
      if (message.value.length < 5) return true;
      return false;
    },
  }))
  .catch((e) => console.log(`Error message from consumer: ${e}`));
