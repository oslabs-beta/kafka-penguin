const { Kafka } = require('kafkajs');
// const msg = process.argv[2];
//create function
const Chance = require('chance')
const chance = new Chance
require('dotenv').config();
run();

async function run() {
  try{
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

    const producer = kafka.producer();
    await producer.connect() 
    console.log('connected')
   
    // console.log(`message sent ${JSON.stringify(result)}`)
    //message 1- 5
    await producer.send({
      topic: 'test-topic',
      messages: [
        {value: 'message 1'}
      ]
    })
    console.log('message 1 sent');

    await producer.send({
      topic: 'test-topic',
      messages: [
        {value: 'message 2'}
      ]
    })
    console.log('message 2 sent');
    
    await producer.send({
      topic: 'wrong-topic',
      messages: [
        {value: 'message 3'}
      ]
    })
    console.log('message 3 sent');

    await producer.send({
      topic: 'test-topic',
      messages: [
        {value: 'message 4!'}
      ]
    })
    console.log('message 4 sent')
    
    await producer.send({
      topic: 'test-topic',
      messages: [
        {value: 'message 5'}
      ]
    })
    console.log('message 5 sent');

    await producer.disconnect()
  } catch (ex) {
    console.error(ex)
  }
  finally {
    process.exit(0);  
  }
}