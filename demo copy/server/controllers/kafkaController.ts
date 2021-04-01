import { Kafka } from 'kafkajs';
import { RequestHandler } from 'express';

const makeClient: RequestHandler =  (req, res, next) => {

  const brokers = !req.body.brokers ? process.env.KAFKA_BOOTSTRAP_SERVER : req.body.brokers
  const kafka = new Kafka({
    clientId: 'makeClient',
    brokers: [brokers],
    ssl: true,
    sasl: {
      mechanism: 'plain',
      username: !req.body.username ? process.env.KAFKA_USERNAME : req.body.username,
      password: !req.body.password ? process.env.KAFKA_PASSWORD : req.body.password
    },
  })
  res.locals.kafka = kafka;
  return next()  
}

export default {
  makeClient,
}