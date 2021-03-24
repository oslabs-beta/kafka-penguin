
  //create test admin and require
  import kafka from '../client'
  
  const admin = kafka.admin();
  const consumer = kafka.consumer();
  const producer = kafka.producer();

  const adminConnect = async () => {
    await admin.connect();    
  }
  const adminDisconnect = async () => {
    await admin.disconnect();
  }

   adminConnect();
   console.log('connect successful');


   adminDisconnect();
   console.log('disconnected bruh');

//test to see if receiving messages



//test failFast strategy => 
  //methods needed: createTopic, createCluster, generateMessages, waitForMessages
  //producer sends messages 1, 2, 3, 4, 5
  //message 3 contains error which breaks application
  //consumer should stop consuming after receving message 2