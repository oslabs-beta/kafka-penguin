/* eslint-disable no-console */
import { RequestHandler } from 'express';
import { Kafka, logLevel } from 'kafkajs';
import { FailFast } from 'kafka-penguin';
// import { DeadLetterQueue } from '../../../kafka-penguin/src/index'
import dotenv = require('dotenv');

dotenv.config();
// cache to store error logs
let ERROR_LOG = [];

const MyLogCreator = (logLevel) => ({
  namespace, level, label, log,
}) => {
  // also availabe on log object => timestamp, logger, message and more
  // console.log(log)
  const { error, correlationId } = log;
  if (correlationId) {
    ERROR_LOG.push(
      `[${namespace}] Logger: kafka-penguin ${label}: ${error} correlationId: ${correlationId}`,
    );
  }
};

// new kafka instance with logCreator added
const failfastKafka = new Kafka({
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
  const newStrategy = new FailFast(req.body.retries - 1, failfastKafka);
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
          `kafka-penguin: FailFast stopped producer after ${ERROR_LOG.length} ${plural}!`,
        );
        res.locals.error = [...ERROR_LOG];
      } else {
        res.locals.error = ['kafka-penguin: Message produced successfully'];
      }

      ERROR_LOG = [];
      return next();
    })
    .catch((e) => next({
      message: `Error implementing FailFast strategy: ${e.message}`,
      error: e,
    }));
};

export default {
  failfast,
};
