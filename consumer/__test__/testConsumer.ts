import {Kafka} from 'kafkajs'
require('dotenv').config();

const consumer = new Kafka({
    'clientId': 'myapp',
    'brokers': [process.env.KAFKA_BOOTSTRAP_SERVER],
    ssl: true,
    sasl: {
      mechanism: 'plain',
      username: process.env.KAFKA_USERNAME,
      password: process.env.KAFKA_PASSWORD
    } 
   
  })
  .consumer()

  module.exports = consumer
