const penguinjs = require('./index.ts')
const devClient = require('./clientConfig.ts')


const strategies = penguinjs.failfast
// Initilize strategy-- passing in your kafkjs client and # of retries
const newStrategy = new strategies.FailFast(2, devClient) 

const message = {
  topic: 'wrong-topic',
    messages: [
      {key: "hello",
       value: "world",
      }
    ]
}
// Initialize producer from strategy
const producer = newStrategy.producer();

producer.connect()
  .then(() => console.log('Connected!'))
  .then(() => producer.send(message))
  .catch((e: any) => console.log("error: ", e.message))

 



