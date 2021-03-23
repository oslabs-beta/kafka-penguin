const {Kafka}= require('kafkajs')
require('dotenv').config();

run();

async function run() {
  try {
    const kafka = new Kafka({
      clientId: 'myapp',
      brokers: [process.env.KAFKA_BOOTSTRAP_SERVER],
      ssl: true,
      sasl: {
        mechanism: 'plain',
        username: process.env.KAFKA_USERNAME,
        password: process.env.KAFKA_PASSWORD
      }     
    })

    const consumer = kafka.consumer({groupId: 'test'});
    console.log('connecting...')

    await consumer.connect()
    console.log('connected!');

    await consumer.subscribe({
      topic: 'test-topic',
      //When fromBeginning is true, the group will use the earliest offset.
      // If set to false, it will use the latest offset. The default is false.
      fromBeginning: false, 
    }) 

    interface ResultObj {
      message: {value: string;}
      partition: number
    }

    await consumer.run({

      eachMessage: async  (result:ResultObj) => {    
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

