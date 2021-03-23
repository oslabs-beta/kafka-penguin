const { Kafka } = require('kafkajs');
require('dotenv').config();

run();

export async function run() {
  try {
    const kafka = new Kafka({
      'clientId': 'myapp',
      'brokers': [process.env.KAFKA_BOOTSTRAP_SERVER],
      ssl: true,
      sasl: {
        mechanism: 'plain',
        username: process.env.KAFKA_USERNAME,
        password: process.env.KAFKA_PASSWORD
      } 
     
    })

    console.log('test')
    const consumer = kafka.consumer({'groupId': 'test'});
    console.log('connecting...')

    await consumer.connect()
    console.log('connected!');

    await consumer.subscribe({
      'topic': 'test-topic',
      'fromBeginning': true, 
    }) 

    await consumer.run({
      'eachMessage': async result => {
        console.log(`Received message ${result.message.value} on partition ${result.partition}`)
      }
    })
  } catch (ex) {
    console.error(ex)
  }
  finally {
    // process.exit(0);  
  }
}
