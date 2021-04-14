import { RequestHandler } from 'express';
import { Kafka, logLevel } from 'kafkajs';
import { DeadLetterQueue } from 'kafka-penguin';
import dotenv = require('dotenv');

dotenv.config();

const ERROR_LOG = [];

const MyLogCreator = (logLevel) => ({
  namespace, level, label, log,
}) => {
  // also availabe on log object => timestamp, logger, message and more
  const { error, correlationId } = log;
  if (correlationId) {
    ERROR_LOG.push(
      `[${namespace}] Logger: kafka-penguin ${label}: ${error} correlationId: ${correlationId}`,
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
  const {
    topic, message, retries, faults,
  } = req.body;

  const messagesArray = [];
  // create messages array with specified number of faults
  for (let i = 0; i < retries; i++) {
    if (i < faults) messagesArray.push({ key: 'test', value: 'fault' });
    else {
      messagesArray.push({
        key: 'test',
        value: message,
      });
    }
  }

  const cb = (message) => {
    if (message.value.toString() === 'fault') {
      return false;
    } return true;
  };

  const admin = DLQKafka.admin();
  const DLQClient = new DeadLetterQueue(DLQKafka, topic, cb);
  const DLQProducer = DLQClient.producer();
  const DLQConsumer = DLQClient.consumer({ groupId: 'demo' });

  res.locals.DLQClients = {
    consumer: DLQConsumer,
    retries,
    faults,
  };
  // DLQProducer.logger().info('TEST', {KAFKA_PENGUIN: 'TESTING CUSTOM'})
  DLQProducer.connect()
    .then(() => {
      DLQProducer.send({
        topic,
        messages: messagesArray,
      }).catch((e) => console.log('this is error in try', e.reference));
    })
    .then(DLQProducer.disconnect())
    .then(admin.connect())
    .then(async () => {
      const offsetData = await admin.fetchTopicOffsets(topic);
      res.locals.latestOffset = offsetData[0].offset;
    })
    .then(admin.disconnect())
    .then(() => next())
    .catch((e: Error) => {
      if (e.message === 'This server does not host this topic-partition') {
        return res.status(300).json([`This error was executed as part of the kafka-penguin 
        Dead Letter Queue message reprocessing strategy. Your producer attempted to deliver
         a message 6 times but was unsuccessful. As a result, the message was sent to a
          Dead Letter Queue. Refer to the original error for further information`]);
      }
      return next({
        message: `Error implementing Dead Letter Queue strategy, producer side:${e.message}`,
        error: e,
      });
    });
};

const dlqConsume: RequestHandler = (req, res, next) => {
  const { faults, consumer, retries } = res.locals.DLQClients;
  const messageLog = [];
  consumer.connect()
    .then(consumer.subscribe())
    .then(() => {
      const latestOffset = Number(res.locals.latestOffset);
      consumer.run({
        eachMessage: ({ topic, partitions, message }) => {
          const messageOffset = Number(message.offset);

          if (messageOffset >= latestOffset - retries) {
            messageLog.push(message.value.toString());
          }
          if (messageLog.length === retries - faults) {
            messageLog.push(`kafka-penguin: Error with message processing, ${faults} ${faults > 1 ? 'messages' : 'message'}
                             sent to DLQ topic ${topic}.deadLetterQueue`);
            res.locals.messages = messageLog;
            consumer.disconnect()
              .then(() => res.status(200).json(res.locals.messages))
              .catch((e) => next({
                message: `Error implementing Dead Letter Queue strategy while consuming messages, consumer side: ${e.message}`,
                error: e,
              }));
          }
        },
      });
    })
    .catch((e) => next({
      message: `Error implementing Dead Letter Queue strategy, consumer side: ${e.message}`,
      error: e,
    }));
};

export default {
  dlqConsume,
  dlqProduce,
};
