const penguinjs = require('./index.ts')
const devClient = require('./clientConfig.ts')


// const failfast = allStrategies.failfastSource;
// const FFP = new failfast.FailFastProducer(0)
// const testProducer = testClient.producer(FFP.FFPClient())
// const failFastProducerConnect = FFP.connect(testProducer.connect, testProducer.disconnect, testProducer.send, {
//     topic: 'wrong-topic',
//         messages: [
//               {
//                 key: 'firstkey',
//                 value: 'Hello World'
//               }
//             ]
//         }) 
        
//         failFastProducerConnect()
//             .then(() => console.log('itworked!'))
const strategies = penguinjs.failfast
const newStrategy = new strategies.FailFast(0, devClient) 
console.log('newStrategy: ', newStrategy);   
const producer = newStrategy.producer();