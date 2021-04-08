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
const devClientDLQ = require('./clientConfig.ts')
const DLQProd = require('./kafka-penguin/src/deadLetterQueue')

// produce to valid topic a series of messages
// one of those messages will contain a deserialization error
// this will prevent consumption of said message, and clog data pipeline... hopefullyc
// const producerDLQ = devClientDLQ.producer();
const topicDLQ = 'heidi';
const wrongTopicDLQ = "bitcoin"

const producerDLQ = new DLQProd(devClientDLQ, topicDLQ, true).producer();


// publishing 3 messages => consumer is expecting JSON as message.value
// forcing error in second message, which blocks data pipeline and consumption of subsequent message
producerDLQ.connect()
  .then(() => console.log('Connected'))
  .then(() => {
   return producerDLQ.createDLQ()
  })
  .then(() => producerDLQ.send({
    topic: topicDLQ,
    messages: [
      {
        key: 'message1',
        value: JSON.stringify('hello'),
      },
      {
        key: 'message2',
        value: 'hey timeo',
      },
      {
        key: 'message3',
        value: JSON.stringify('hello'),
      },
      {
        key: 'message1',
        value: JSON.stringify('hello'),
      },
      {
        key: 'message2',
        value: 'hey timeo',
      },
      {
        key: 'message3',
        value: JSON.stringify('hello'),
      },
      {
        key: 'message1',
        value: JSON.stringify('hello'),
      },
    ],
  }))
  .then(() => producerDLQ.send ({
    topic: wrongTopicDLQ,
    messages: [
      {
        key: 'message 4',
        value: JSON.stringify('hello'),
      }
    ]
  }))
  .then(() => producerDLQ.send ({
    topic: topicDLQ,
    messages: [
      {
        key: 'message 5',
        value: JSON.stringify('hello'),
      }
    ]
  })) 
  .then(() => console.log('messages sent'))
  .then(() => producerDLQ.disconnect())
  .catch((e: any) => {
    console.log(e);
  });


```

\*\*\*\*

**.consumer \(  \)** mimics the KafkaJs' built-in 'consumer\( \)' method under the hood.

Here is an example of employing DLQ for a consumer: 

```javascript
const DLQConsumer =  require('./kafka-penguin/src/deadLetterQueue');
const client = require('./clientConfig.ts');

// conditional should include ANY error that may occur during consumption
// pushing fault message to relevant DLQ topic

// create new topic => topic.dead-letter-queue
// instantiate consumer with DLQ plugin that takes in a callback, which is a filter for messages
// consumer should also take in a client which pushes faulty messages to DLQ topic

// client is used to create new topic => topic.dead-letter-queue

const topic = 'heidi';
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



```



\`\`



