"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

Object.defineProperty(exports, "__esModule", { value: true });

class DeadLetterQueueErrorProducer extends Error {
    constructor(e) {
        super(e);
        Error.captureStackTrace(this, this.constructor);
        this.strategy = 'Dead Letter Queue';
        this.reference = `This error was executed as part of the kafka-penguin Dead Letter Queue message reprocessing strategy. Your producer attempted to deliver a message ${e.retryCount + 1} times but was unsuccessful. As a result, the message was sent to a Dead Letter Queue. Refer to the original error for further information`;
        this.name = e.name + '(Producer Side)';
        this.message = e.message;
        this.originalError = e.originalError;
        this.retryCount = e.retryCount;
    }
}
class DeadLetterQueueErrorConsumer extends Error {
    constructor(e) {
        super(e);
        Error.captureStackTrace(this, this.constructor);
        this.strategy = 'Dead Letter Queue';
        this.reference = `This error was executed as part of the kafka-penguin Dead Letter Queue message reprocessing strategy. Your consumer attempted to receive a message ${e.retryCount + 1} times but was unsuccessful. As a result, the message was sent to a Dead Letter Queue. Refer to the original error for further information`;
        this.name = e.name + '(Consumer Side)';
        this.message = e.message;
        this.originalError = e.originalError;
        this.retryCount = e.retryCount;
    }
}
class DeadLetterQueue {
    constructor(client, topic, callback) {
        this.topic = topic;
        this.client = client;
        this.callback = callback;
        this.admin = this.client.admin();
        this.innerConsumer = null;
        this.innerProducer = this.client.producer();
    }
    producer() {
        // Reference the DLQ instance for closure in the returned object
        const dlqInstance = this;
        const { innerProducer } = dlqInstance;
        // Return an object with all Producer methods adapted to execute a dead letter queue strategy
        return {
            connect() {
                return innerProducer.connect().then(() => {
                    dlqInstance.createDLQ();
                });
            },
            disconnect() {
                return innerProducer.disconnect();
            },
            send(message) {
                return innerProducer.send(message)
                    // Upon error, reroute message to DLQ for the strategy topic
                    .catch((e) => {
                    innerProducer.send(Object.assign(Object.assign({}, message), { topic: `${dlqInstance.topic}.deadLetterQueue` }));
                    // Print the error to the console
                    const newError = new DeadLetterQueueErrorProducer(e);
                    console.log(newError);
                });
            }
        };
    }
    consumer(groupId) {
        this.innerConsumer = this.client.consumer(groupId);
        const dlqInstance = this;
        const { innerConsumer, innerProducer } = dlqInstance;
        // Returns an object with all Consumer methods adapter to execute a dead letter queue strategy
        return {
            connect() {
                return innerConsumer.connect().then(() => {
                    dlqInstance.createDLQ();
                });
            },
            disconnect() {
                return innerConsumer.disconnect();
            },
            subscribe() {
                return innerConsumer.subscribe({ topic: dlqInstance.topic, fromBeginning: false });
            },
            run(input) {
                const { eachMessage } = input;
                return innerConsumer.run({
                    eachMessage: ({ topic, partitions, message }) => {
                        try {
                            //If user doesn't pass in callback, DLQ simply listens and returns errors
                            if (dlqInstance.callback && dlqInstance.callback(message)) {
                                dlqInstance.callback(message);
                            }
                            eachMessage({ topic, partitions, message });
                        }
                        catch (e) {
                            const newError = new DeadLetterQueueErrorConsumer(e);
                            console.error(newError);
                            innerProducer.connect()
                                .then(() => console.log('kafka-penguin: Connected to DLQ topic'))
                                .then(() => {
                                innerProducer.send({
                                    topic: `${dlqInstance.topic}.deadLetterQueue`,
                                    messages: [message],
                                });
                            })
                                .then(() => console.log('kafka-penguin: Message published to DLQ'))
                                .then(() => innerProducer.disconnect())
                                .then(() => console.log('kafka-penguin: Producer disconnected'))
                                .catch((e) => console.log('Error with producing to DLQ: ', e));
                        }
                    },
                });
            }
        };
    }
    // Creates a new DLQ topic with the original topic name
    createDLQ() {
        return __awaiter(this, void 0, void 0, function* () {
            const adminCreateDLQ = yield this.admin.connect()
                .then(() => __awaiter(this, void 0, void 0, function* () {
                yield this.admin.createTopics({
                    topics: [{
                            topic: `${this.topic}.deadLetterQueue`,
                            numPartitions: 1,
                            replicationFactor: 1,
                            replicaAssignment: [{ partition: 0, replicas: [0, 1, 2] }],
                        }],
                });
            }))
                .then(() => this.admin.disconnect())
                .catch((err) => console.log('Error from createDLQ', err));
            return adminCreateDLQ;
        });
    }
}

exports.default = DeadLetterQueue;

