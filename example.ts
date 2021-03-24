const allStrategies  = require('./index.ts');
const testClient = require('./clientConfig.ts')

// const { Kafka } = require('kafkajs')
//  import kafka from './clientConfig'
// const { DLQ, failureAdapters } = require('kafkajs-dlq')


// const client = new Kafka({ ... })
// const dlq = new DLQ({ client })
const failfast = allStrategies.failfastSource;
// const deadLetterQueue = allStrategies.deadLetterQueueSource;
// console.log('example strategy: ', failfast, 'hello world: ', helloworld);
//what changes to make to client.producer so that failfast is implemented by default

    //INSTANTIATING PRODUCERclwar
        
        //const producer = client.producer(failfastSetting) ---> set num of retries
            //Ex: const producer = testClient.producer(failfast.failfastProducerClient)
        const testProducer = testClient.producer(failfast.failfastProducerClient(0))
        const failFastProducerConnect = failfast.failfastProducerConnect(testProducer.connect, testProducer.disconnect, testProducer.send, {
            topic: 'wrong-topic',
            messages: [
              {
                key: 'firstkey',
                value: 'Hello World'
              }
            ]
        }, 0) //---> returns function which has timer built in
        
        failFastProducerConnect()
            .then(() => console.log('itworked!'))
// const topic = 'example-topic'
// const failureAdapter = new failureAdapters.Kafka({ client, topic: `${topic}.dead-letter-queue` })

// const { eachMessage } = dlq.consumer({
//   topics: {
//     [topic]: { failureAdapter }
//   },
//   eachMessage: async ({ topic, partition, message }) => {
//     throw new Error('Failed to process message')
//   }
// })

// const consumer = client.consumer({ ... })

// const run = async () => {
//   await consumer.connect()
//   await consumer.subscribe({ topic })
//   await consumer.run({ eachMessage })
// }

// run() 