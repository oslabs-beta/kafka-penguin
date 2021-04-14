/* eslint-disable no-console */
import { FailFast } from './kafka-penguin/src/index';

const FailFastClient = require('./clientConfig.ts');

// Set up Fail Fast with the number of retried and a configured KafkaJS client
const exampleFailFast = new FailFast(2, FailFastClient);

// Initialize a producer from the new instance of Fail Fast
const producer = exampleFailFast.producer();

// Example error of a producer sending to a non-existent topic
const message = {
  topic: 'topic-non-existent',
  messages: [
    {
      key: 'hello',
      value: 'world',
    },
  ],
};

// Fail Fast will attempt to send the message to the Kafka cluster.
// After the retry count is reached, the producer will automatically disconnect.
// An Error is also thrown.
producer.connect()
  .then(() => console.log('Connected!'))
  .then(() => producer.send(message))
  .catch((e: any) => console.log('error: ', e.message));
