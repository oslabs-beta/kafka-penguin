import devClient from './clientConfig';

// produce to valid topic a series of messages
// one of those messages will contain a deserialization error
// this will prevent consumption of said message, and clog data pipeline... hopefullyc
const producer = devClient.producer();
const topic = 'heidi';

// publishing 3 messages => consumer is expecting JSON as message.value
// forcing error in second message, which blocks data pipeline and consumption of subsequent message
producer.connect()
  .then(() => console.log('Connected'))
  .then(() => producer.send({
    topic,
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
  .then(() => console.log('messages sent'))
  .then(() => producer.disconnect())
  .catch((e: any) => {
    console.log(e);
  });
