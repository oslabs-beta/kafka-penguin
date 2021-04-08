const devClientDLQ = require('./clientConfig.ts')
import { DeadLetterQueue } from './kafka-penguin/src/index'

// produce to valid topic a series of messages
// one of those messages will contain a deserialization error
// this will prevent consumption of said message, and clog data pipeline... hopefullyc
// const producerDLQ = devClientDLQ.producer();
const topicDLQ = 'heidi';
const wrongTopicDLQ = "bitcoin"

const exampleDLQProducer = new DeadLetterQueue(devClientDLQ, topicDLQ, true);
const producerDLQ = exampleDLQProducer.producer();

// publishing 3 messages => consumer is expecting JSON as message.value
// forcing error in second message, which blocks data pipeline and consumption of subsequent message
producerDLQ.connect()
  .then(() => console.log('Connected'))
  .then(() => producerDLQ.send({
    topic: topicDLQ,
    messages: [
      {
        key: 'message1',
        value: JSON.stringify('Producer'),
      },
      {
        key: 'message2',
        value: 'hey timeo',
      },
      {
        key: 'message3',
        value: JSON.stringify('Producer'),
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
        value: JSON.stringify('bad message'),
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
