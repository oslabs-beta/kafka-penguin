import { Kafka } from 'kafkajs';
import { RequestHandler } from 'express';

const makeClient: RequestHandler =  (req, res, next) => {

  const kafka = new Kafka({
    clientId: 'makeClient',
    brokers: [req.body.brokers],
    ssl: true,
    sasl: {
      mechanism: 'plain',
      username: req.body.username,
      password: req.body.password
    } 
  })
  res.locals.kafka = kafka;
  return next()  
}

export default {
  makeClient,
}