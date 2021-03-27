import { Kafka } from 'kafkajs';
import { RequestHandler } from 'express';

const makeClient: RequestHandler =  (req, res, next) => {
  console.log('Inside of makeClient');
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
  console.log('Kafka is', kafka);
  res.locals.kafka = kafka;
  return next()  
}

export default {
  makeClient,
}