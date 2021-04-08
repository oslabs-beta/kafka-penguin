import { FailFast } from './kafka-penguin/src/index'
const devClient = require('./clientConfig.ts')

// Initilize strategy-- passing in your kafkjs client and # of retries
const exampleFailFast = new FailFast(2, devClient)

// Initialize producer from strategy
const producer = exampleFailFast.producer();

const message = {
  topic: 'wrong-topic',
  messages: [
    {
      key: 'hello',
      value: 'world',
    }
  ]
}

producer.connect()
  .then(() => console.log('Connected!'))
  .then(() => producer.send(message))
  .catch((e: any) => console.log('error: ', e.message))


