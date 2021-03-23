
// const {
//     secureRandom,
//     createCluster,
//     createTopic,
//     createModPartitioner,
//     newLogger,
//     waitFor,
//     waitForMessages,
//     waitForNextEvent,
//     testIfKafkaAtLeast_0_11,
//     waitForConsumerToJoinGroup,
//     generateMessages,
//   } = require('./__testHelpersConsumer')

  //create test admin and require
  import admin from './testAdmin'
  // //create test producer and require
  // // const testProducer = require('./testProducer');
  // // //create test consumer and require
  // // const testConsumer = require('./testConsumer');
   async function connect() {
     await admin.connect();    
    }

    connect();

   console.log('connect successful')

   async function disconnect() {
    await admin.disconnect();
   }

   disconnect();

   console.log('disconnected bruh')

//test to see if receiving messages



//test failFast strategy => 
  //methods needed: createTopic, createCluster, generateMessages, waitForMessages
  //producer sends messages 1, 2, 3, 4, 5
  //message 3 contains error which breaks application
  //consumer should stop consuming after receving message 2