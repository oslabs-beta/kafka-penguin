import { RequestHandler } from 'express';
import { Kafka, logLevel } from 'kafkajs';
// const kafkapenguin = require('kafka-penguin');
import { FailFast, DeadLetterQueue } from 'kafka-penguin';
// import { DeadLetterQueue } from '../../../kafka-penguin/src/index'
import dotenv = require('dotenv');
dotenv.config();
//cache to store error logs
let ERROR_LOG = [];
let MESSAGE_LOG = [];


const MyLogCreator = logLevel => ({ namespace, level, label, log }) => {
  //also availabe on log object => timestamp, logger, message and more
  const { error, correlationId } = log;
  if (correlationId) {
    ERROR_LOG.push(
      `[${namespace}] Logger: kafka-penguin ${label}: ${error} correlationId: ${correlationId}`
    );
  }
};

//new kafka instance with logCreator added
const strategyKafka = new Kafka({
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

const failfast: RequestHandler = (req, res, next) => {
  // const strategies = kafkapenguin.failfast;
  // const newStrategy = new strategies.FailFast(req.body.retries - 1, strategyKafka);
  const newStrategy = new FailFast(req.body.retries - 1, strategyKafka);
  const producer = newStrategy.producer();
  const message = {
    topic: req.body.topic,
    messages: [
      {
        key: 'hello',
        value: req.body.message,
      },
    ],
  };
  producer
    .connect()
    .then(() => console.log('Connected'))
    .then(() => producer.send(message))
    .then(() => {
      if (ERROR_LOG.length > 0) {
        const plural = ERROR_LOG.length > 1 ? 'times' : 'time';
        ERROR_LOG.push(
          `kafka-penguin: FailFast stopped producer after ${ERROR_LOG.length} ${plural}!`
        );
        res.locals.error = [...ERROR_LOG];
      } else {
        res.locals.error = ['kafka-penguin: Message produced successfully'];
      }

      ERROR_LOG = [];
      return next();
    })
    .catch(e => {
      return next({
        message: 'Error implementing FailFast strategy: ' + e.message,
        error: e,
      });
    });
};

const dlqProduce: RequestHandler = (req, res, next) => {
  //create messages array with specified number of faults
  const { topic, message, retries, faults } = req.body;
  const random = (count, messages, result = new Set()) => {
    if (result.size === count) return result;
    const num = Math.floor(Math.random() * messages);
    result.add(num);
    return random(count, messages, result);
  };

  const faultsIndex = random(faults, retries);

  const messagesArray = [];

  for (let i = 0; i < retries; i++) {
    if (faultsIndex.has(i)) messagesArray.push({ key: 'test', value: 'fault' });
    else
      messagesArray.push({
        key: 'test',
        value: message,
      });
  }

  const cb = message => {
    if (message === 'fault')
      return false;
    return true;
  };
  console.log('topic-----------', topic);
  console.log(messagesArray);
  const DLQClient = new DeadLetterQueue(strategyKafka, topic, cb);
  // produce message to topic
  const DLQProducer = DLQClient.producer();
  // const DLQProducer = res.locals.kafka.producer();
  const DLQConsumer = DLQClient.consumer({ groupId: 'demo' });

  DLQProducer.connect()
    .then(
      DLQProducer.send({
        topic: topic,
        messages: messagesArray,
      })
    )
    .then(DLQProducer.disconnect())
    .then(() => {
      // res.locals.clientInfo = {
      //   brokers: process.env.KAFKA_BOOTSTRAP_SERVER,
      //   username: process.env.KAFKA_USERNAME,
      //   password: process.env.KAFKA_PASSWORD,
      // };
      res.locals.DLQClients = {
        producer: DLQProducer,
        consumer: DLQConsumer,
        retries: retries
      }
      
      return next();
    })
    .catch(e => {
      console.log(e);
    });
};

const dlqConsume: RequestHandler = (req, res, next) => {
  const { producer, consumer, retries } = res.locals.DLQClients
  let messageLog = [];
  consumer.connect()
    .then(consumer.subscribe())
    .then(() => {
      // const run = () => { 
      consumer.run({
        eachMessage: ({topic, partitions, message}) => {
          console.log(message.value.toString())
          messageLog.push(message.value.toString())
          console.log(messageLog);
          if (messageLog.length === retries) {
            res.locals.messages = [...messageLog];
            messageLog = [];
            consumer.disconnect()
              .then(() => {
                return res.status(200).json(res.locals.messages)
              })
      
    
          }
        }
      })
    // }
  })
    .then(async () => {
      console.log('message log', await messageLog)
    })
    .then(console.log(messageLog))
    .catch((e: Error) => console.log)

};

export default {
  failfast,
  dlqProduce,
  dlqConsume,
};
