"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { Kafka } = require('kafkajs');
require('dotenv').config();
// Create the client with the broker list
const kafka = new Kafka({
    clientId: 'fail-fast-producer',
    brokers: [process.env.KAFKA_BOOTSTRAP_SERVER],
    ssl: true,
    sasl: {
        mechanism: 'plain',
        username: process.env.KAFKA_USERNAME,
        password: process.env.KAFKA_PASSWORD,
    },
});
exports.default = kafka;
