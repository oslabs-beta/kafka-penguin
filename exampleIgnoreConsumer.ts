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
