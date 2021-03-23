const { Kafka } = require('kafkajs');
require('dotenv').config();
//create function
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
    const admin = kafka.admin();
    console.log('connecting...')
    await admin.connect()
    console.log('connected!');
    //create topic
    //A-M N-Z
    await admin.createTopics({
      waitForLeaders: true,  
      topics: [{
        topic: 'test-topic',
        numPartitions: 1,
        // replicationFactor : 6,
        replicaAssignment : [{ partition: 0, replicas: [0,1,2] }],
        // configEntries : [{ name: 'cleanup.policy', value: 'compact' }],   
      }]
    })
    console.log('created successfully! ', await admin.fetchTopicMetadata())
    await admin.disconnect()
  } catch (ex) {
    console.error('Error caught: ', ex)
  }
  finally {
    process.exit(0);  
  }
}