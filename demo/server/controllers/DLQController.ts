import { RequestHandler } from 'express';
import { Kafka, logLevel } from 'kafkajs';
import { DeadLetterQueue } from 'kafka-penguin';
import dotenv = require('dotenv');
dotenv.config();

let ERROR_LOG = [];

const MyLogCreator = logLevel => ({ namespace, level, label, log }) => {
  //also availabe on log object => timestamp, logger, message and more
  // console.log('this is MyLogCreator', log)
  const { error, correlationId } = log;
  if (correlationId) {
    ERROR_LOG.push(
      `[${namespace}] Logger: kafka-penguin ${label}: ${error} correlationId: ${correlationId}`
    );
  }
};

const DLQKafka = new Kafka({
  clientId: 'makeClient',
  brokers: [process.env.KAFKA_BOOTSTRAP_SERVER],
  ssl: true,
  sasl: {
    mechanism: 'plain',
    username: process.env.KAFKA_USERNAME,
    password: process.env.KAFKA_PASSWORD,
  },
  logLevel: logLevel.ERROR,
  logCreator: MyLogCreator,
});

const dlqProduce: RequestHandler = (req, res, next) => {
  
  const { topic, message, retries, faults } = req.body;

  const messagesArray = [];
  //create messages array with specified number of faults
  for (let i = 0; i < retries; i++) {
    if (i < faults) messagesArray.push({ key: 'test', value: 'fault' });
    else messagesArray.push({
            key: 'test',
            value: message,
          });
  };

  const cb = message => {
    if (message.value.toString() === 'fault') {
      return false
    } else return true;
  };
  
  const admin = DLQKafka.admin()
  const DLQClient = new DeadLetterQueue(DLQKafka, topic, cb);
  const DLQProducer = DLQClient.producer();
  const DLQConsumer = DLQClient.consumer({ groupId: 'demo' });

  res.locals.DLQClients = {
    consumer: DLQConsumer,
    retries: retries,
    faults: faults
  };

  DLQProducer.connect()
    .then(() => {
      DLQProducer.send({
        topic: topic,
        messages: messagesArray,
      })
    })
    .then(DLQProducer.disconnect())
    .then(admin.connect())
    .then(async () => {
      const offsetData = await admin.fetchTopicOffsets(topic)
      res.locals.latestOffset = offsetData[0].offset
    })
    .then(admin.disconnect())
    .then(() => {
      return next();
    })
    .catch(e => {
      return next({
        message: 'Error implementing Dead Letter Queue strategy, producer side:' + e.message,
        error: e,
      });
    });
};



const dlqConsume: RequestHandler = (req, res, next) => {
  const { faults, consumer, retries } = res.locals.DLQClients
  let messageLog = [];
  consumer.connect()
    .then(consumer.subscribe())
    .then(() => {
      const latestOffset = Number(res.locals.latestOffset)
      consumer.run({
        eachMessage: ({topic, partitions, message}) => {
          const messageOffset = Number(message.offset)
      
          if (messageOffset >= latestOffset - retries) {
            messageLog.push(message.value.toString())
          };     
          if (messageLog.length === retries - faults) {
            messageLog.push(`kafka-penguin: Error with message processing, ${faults} ${faults > 1 ? 'messages' : 'message'}
                             sent to DLQ topic ${topic}.deadLetterQueue`)
            res.locals.messages = messageLog;
            consumer.disconnect()
              .then(() => {
                return res.status(200).json(res.locals.messages)
              })
              .catch(e => {
                return next({
                  message: 'Error implementing Dead Letter Queue strategy while consuming messages, consumer side: ' + e.message,
                  error: e
                });
              });
          };
        },
      });
    })
    .catch(e => {
      return next({
        message: 'Error implementing Dead Letter Queue strategy, consumer side: ' + e.message,
        error: e
      });
    });
};

export default {
  dlqConsume,
  dlqProduce
};