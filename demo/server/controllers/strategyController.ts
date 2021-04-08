import { RequestHandler } from 'express'
import { Kafka, logLevel } from 'kafkajs';
const kafkapenguin = require('kafka-penguin');
import { DeadLetterQueue } from '../../../kafka-penguin/src/index'
import dotenv = require('dotenv')
dotenv.config();
//cache to store error logs
let ERROR_LOG = [];

const MyLogCreator = logLevel => ({ namespace, level, label, log }) => {
  //also availabe on log object => timestamp, logger, message and more
  const { error, correlationId } = log
  if (correlationId) {
    ERROR_LOG.push(`[${namespace}] Logger: kafka-penguin ${label}: ${error} correlationId: ${correlationId}`)
  }
  
}

//new kafka instance with logCreator added
const strategyKafka = new Kafka({
  clientId: 'makeClient',
  brokers: [process.env.KAFKA_BOOTSTRAP_SERVER],
  ssl: true,
  sasl: {
    mechanism: 'plain',
    username: process.env.KAFKA_USERNAME,
    password: process.env.KAFKA_PASSWORD
  },
  logLevel: logLevel.ERROR,
  logCreator: MyLogCreator,
});

const failfast: RequestHandler = (req, res, next) => {

  const strategies = kafkapenguin.failfast;
  const newStrategy = new strategies.FailFast(req.body.retries - 1, strategyKafka);
  const producer = newStrategy.producer();
  const message = {
    topic: req.body.topic,
    messages: [
      {
        key: 'hello',
        value: req.body.message,
      }
    ]
  };
 producer.connect()
    .then(() => console.log('Connected'))
    .then(() => producer.send(message))
    .then(() => {
      if (ERROR_LOG.length > 0) {
        const plural = ERROR_LOG.length > 1 ? 'times' : 'time'
        ERROR_LOG.push(`kafka-penguin: FailFast stopped producer after ${ERROR_LOG.length} ${plural}!`)
        res.locals.error = [...ERROR_LOG]
      } else {res.locals.error = ['kafka-penguin: Message produced successfully']};

      ERROR_LOG = [];
      return next();
    })
    .catch(e => {
      return next({
        message: 'Error implementing FailFast strategy: ' + e.message,
        error: e
      })
    });
};

const dlq: RequestHandler = (req, res, next) => {
  //create messages array with specified number of faults
  const { topic, message, retries, faults } = req.body
  const random = (count, messages, result = new Set()) => {
    if (result.size === count) return result;
    const num = Math.floor(Math.random() * messages)
    result.add(num);
    return random(count, messages, result);
  }

  const faultsIndex = random(faults, retries)
  const messagesArray = Array.from(message.repeat(retries))
                             .map((el, i) => {
                               const message = {
                                 key: 'hello',
                                 message: faultsIndex.has(i) ? 'fault' : el
                               }
                               return message
                             })
  
  const cb = (message) => {
    if (message === 'fault') return 'kafka-penguin: faulty message has been published to DLQ'
    return true
  }
  const DLQClient = new DeadLetterQueue(res.locals.kafka, topic, cb)
  // produce message to topic
  const DLQProducer = DLQClient.producer();
  const DLQConsumer = DLQClient.consumer({groupId: 'demo'})

  
                             

}

export default {
  failfast,
  dlq
}