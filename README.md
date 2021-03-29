# Kafka-Penguin

[![Build Status](https://travis-ci.com/Nevon/kafkajs-dlq.svg?branch=master)](https://travis-ci.com/Nevon/kafkajs-dlq)
[![npm version](https://badge.fury.io/js/kafkajs-dlq.svg)](https://badge.fury.io/js/kafkajs-dlq)

[KafkaJS](https://github.com/tulios/kafkajs) plugin to handle message
processing failures by failing fast. 

> Failing fast is a easy-to-use, light weight KafkaJS library for message processing. It provides 
> developers with a single strategy for immediately resolving any data flow issues from the different 
> microservices that rely on Kafka.  

**WIP: This project is not ready for use as of yet**

## Usage

```javascript
const allStrategies  = require('./index.ts');
const testClient = require('./clientConfig.ts')

const failfast = allStrategies.failfastSource;

    //INSTANTIATING PRODUCER
        //const producer = client.producer(failfastSetting) ---> set num of retries
            //Ex: const producer = testClient.producer(failfast.failfastProducerClient)
        const FFP = new failfast.FailFastProducer(0)
        const testProducer = testClient.producer(FFP.FFPClient())
        const failFastProducerConnect = FFP.FFPConnect(testProducer.connect, testProducer.disconnect, testProducer.send, {
            topic: 'wrong-topic',
            messages: [
              {
                key: 'firstkey',
                value: 'Hello World'
              }
            ]
        }) //---> returns function which has timer built in
        
        failFastProducerConnect()
            .then(() => console.log('itworked!'))
            
            
                //consumer instantiate
        const FFC = new failfast.FailFastConsumer()
        const testConsumer = testClient.consumer()
        //consumer connect
        const testConsumerExecute = async () => { 
          await testConsumer.connect()
        //ONLY CHANGE TO CONSUMER IS WHEN .SUBSCRIBE IS INVOKED
         //consumer subscribe ==> topic + fromBeginning === false
        await testConsumer.subscribe(FFC.FFCSubscribe('topic'))
        await testConsumer.run({})
        await testConsumer.disconnect()
        }
       
        testConsumerExecute()
        

