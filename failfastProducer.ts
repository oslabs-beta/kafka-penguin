// requires
const SetInterval =  require('set-interval');
const client = require('./clientConfig.ts')

// set up
let recountNum = 0;
const producer = client.producer({ retry: { retries: recountNum }});

//Default Message that works
const sendMessage = () =>  {
  return producer.send(
    {
    topic: 'test1', 
    messages: [{ key: 'firstkey', value: 'Hello World' }]
    }
  )
    .then(() => console.log('Message sent!'))
};

// Message sending to the nonexistent topic
const errorMessageWrongTopic = () => {
  return producer.send({
    topic: 'wrong-topic',
    messages: [
      {
        key: 'firstkey',
        value: 'Hello World'
      }
    ]
  })
  .then((res: any) => console.log('This is our res ', res))
  .catch((e: { retryCount?: any; }) => {
     // kill process once it hits recount target
     if (e.retryCount >= recountNum) {
       console.log(`disconnect after ${recountNum} times!`);
       producer.disconnect();
       SetInterval.clear('sayMyName');
      }
  })
}

//Producer
let producerConnect = async () => {
  await producer.connect();
  SetInterval.start(errorMessageWrongTopic, 3000, 'sayMyName') // Swap out different message/error types here
};

// app listener
producerConnect()
  .then(() => {
    console.log('Connected') })
  .catch(() => console.log('Not connected'));


