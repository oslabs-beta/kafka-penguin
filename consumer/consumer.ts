const {Kafka}= require('kafkajs')
require('dotenv').config();
import kafka from './client'

const consumer = kafka.consumer({groupId: 'test'});

const consumerConnect = async () => {
  await consumer.connect()
  console.log('Connected')
}

const consumerSubscribe = async () => {
  await consumer.subscribe({
    topic: 'test-topic',
    //When fromBeginning is true, the group will use the earliest offset.
    // If set to false, it will use the latest offset. The default is false.
    fromBeginning: false, 
  }) 
}

const consumerDisconnect = async () => {
  await consumer.disconnect();
  console.log('Disconnected')
}

const consumerRun = async () => {
  await consumer.run({
    eachMessage: async  (result: { message: { value: any; }; partition: any; }) => {    
      console.log(`Received message ${result.message.value} on partition ${result.partition}`)
    }
<<<<<<< HEAD

    await consumer.run({

      eachMessage: async  (result:ResultObj) => {    
        console.log(`Received message ${result.message.value} on partition ${result.partition}`)
      }
    })
  }
  .then(() => console.log('success'))
  .catch (ex => console.error(ex))
  .finally(() => // process.exit(0); )
      
=======
  })
>>>>>>> 6a2a8cef06d601751f8d5dbee9a24a2aa97930e3
}
//executing function calls
consumerConnect()
  .then(() => consumerSubscribe())
  .then(() => consumerRun())
  .then(() => consumerDisconnect())  
  .catch(error => {
    console.log('Error in consumer: ', error)
  })  
  .finally(() => process.exit(0))

