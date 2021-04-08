import { FailFast } from 'kafka-penguin'
const exampleClient = require('./clientConfig.ts')

// Set up the preferred strategy with a configured KafkaJS client
const exampleStrategy = new FailFast(2, exampleClient)

// Initialize a producer or consumer from the instance of the strategy
const producer = exampleStrategy.producer();

const message = {
  topic: 'wrong-topic',
  messages: [
    {
      key: 'hello',
      value: 'world',
    }
  ]
}

// Connect, Subscribe, Send, or Run virtually the same as with KafkaJS
producer.connect()
  .then(() => console.log('Connected!'))
  // The chosen strategy executes under the hood, like in this send method
  .then(() => producer.send(message))
  .catch((e: any) => console.log('error: ', e.message))


