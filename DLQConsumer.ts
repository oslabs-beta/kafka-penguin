const DLQConsumer =  require('./kafka-penguin/src/deadLetterQueue');
const client = require('./clientConfig.ts');

// conditional should include ANY error that may occur during consumption
// pushing fault message to relevant DLQ topic

// create new topic => topic.dead-letter-queue
// instantiate consumer with DLQ plugin that takes in a callback, which is a filter for messages
// consumer should also take in a client which pushes faulty messages to DLQ topic

// client is used to create new topic => topic.dead-letter-queue

const topic = 'dlq2';
const callback = (message) => {
  try {
    JSON.parse(message.value);
  } catch (e) {
    return false;
  }
  return true;
};

const callback2 = (message: any) => (!!Array.isArray(message.value));

// const strategies = penguinjs.DLQ;
// const newStrategy = new strategies.DLQ(client, topic, callback);
// DLQ
// 1. create new topic with topic.dead-letter-queue
// 2. create and store producer/adapter which handles callback checks
// 3. redefine .run function to include check for faulty messages
// 4. if doesnt pass test, use adapter to post to DLQ
// callback is optional
const dlq = new DLQConsumer(client, topic);
const consumer = dlq.consumer({ groupId: 'whatever' });

consumer.connect()
  .then(consumer.subscribe())
  .then(console.log('consumer is subscribed'))
  .then(consumer.createDLQ())
  .then(() => consumer.run({
    eachMessage: ({ topic, partitions, message }) => {
      console.log(JSON.parse(message.value));
    },
  }))
  .catch((e) => console.log(`Error message from consumer.connect ${e}`));



