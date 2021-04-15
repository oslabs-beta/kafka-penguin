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
exports.IgnoreErrorConsumer = exports.IgnoreErrorProducer = exports.DeadLetterQueue = exports.DeadLetterQueueErrorProducer = exports.DeadLetterQueueErrorConsumer = exports.FailFast = exports.FailFastError = void 0;
// Fail Fast Strategy
class FailFastError extends Error {
    constructor(e) {
        super(e);
        Error.captureStackTrace(this, this.constructor);
        this.strategy = 'Fail Fast';
        this.reference = `This error was executed as part of the kafka-penguin Fail Fast message reprocessing strategy. Your producer attempted to deliver a message ${e.retryCount + 1} times but was unsuccessful. As a result, the producer successfully executed a disconnect operation. Refer to the original error for further information`;
        this.name = e.name;
        this.message = e.message;
        this.originalError = e.originalError;
        this.retryCount = e.retryCount;
    }
}
exports.FailFastError = FailFastError;
class FailFast {
    constructor(num, kafkaJSClient) {
        this.retry = num;
        this.client = kafkaJSClient;
        this.innerProducer = null;
    }
    producer() {
        const options = {
            retry: { retries: this.retry },
        };
        // Create a producer from client passing in retry options
        // Save to FailFast class
        this.innerProducer = this.client.producer(options);
        // Return curr FailFast instance instead of a producer
        return this;
    }
    connect() {
        return this.innerProducer.connect();
    }
    disconnect() {
        return this.innerProducer.disconnect();
    }
    send(message) {
        return this.innerProducer.send(message)
            .catch((e) => {
            this.innerProducer.disconnect();
            const newError = new FailFastError(e);
            // eslint-disable-next-line no-console
            console.log(newError);
        });
    }
}
exports.FailFast = FailFast;
// Dead Letter Queue
class DeadLetterQueueErrorConsumer extends Error {
    constructor(e) {
        super(e);
        Error.captureStackTrace(this, this.constructor);
        this.strategy = 'Dead Letter Queue';
        this.reference = `This error was executed as part of the kafka-penguin Dead Letter Queue message reprocessing strategy. Your consumer attempted to receive a message ${e.retryCount + 1} times but was unsuccessful. As a result, the message was sent to a Dead Letter Queue. Refer to the original error for further information`;
        this.name = `${e.name}(Consumer Side)`;
        this.message = e.message;
        this.originalError = e.originalError;
        this.retryCount = e.retryCount;
    }
}
exports.DeadLetterQueueErrorConsumer = DeadLetterQueueErrorConsumer;
class DeadLetterQueueErrorProducer extends Error {
    constructor(e) {
        super(e);
        Error.captureStackTrace(this, this.constructor);
        this.strategy = 'Dead Letter Queue';
        this.reference = `This error was executed as part of the kafka-penguin Dead Letter Queue message reprocessing strategy. Your producer attempted to deliver a message ${e.retryCount + 1} times but was unsuccessful. As a result, the message was sent to a Dead Letter Queue. Refer to the original error for further information`;
        this.name = `${e.name}(Producer Side)`;
        this.message = e.message;
        this.originalError = e.originalError;
        this.retryCount = e.retryCount;
    }
}
exports.DeadLetterQueueErrorProducer = DeadLetterQueueErrorProducer;
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
        console.log('INNER PRODUCER', innerProducer);
        return Object.assign(Object.assign({}, innerProducer), { connect() {
                return innerProducer.connect()
                    .then(() => {
                    dlqInstance.createDLQ();
                })
                    .catch((e) => console.log(e));
            },
            send(message) {
                return innerProducer.connect()
                    .then(() => {
                    innerProducer.send(Object.assign(Object.assign({}, message), { topic: message.topic, messages: message.messages }))
                        // Upon error, reroute message to DLQ for the strategy topic
                        .catch((e) => {
                        innerProducer.send({
                            messages: message.messages,
                            topic: `${dlqInstance.topic}.deadLetterQueue`,
                        })
                            .then(innerProducer.disconnect())
                            .catch((e) => console.log(e));
                        // Print the error to the console
                        const newError = new DeadLetterQueueErrorProducer(e);
                        console.log(newError);
                    });
                });
            } });
    }
    consumer(groupId) {
        this.innerConsumer = this.client.consumer(groupId);
        const dlqInstance = this;
        const { innerConsumer, innerProducer } = dlqInstance;
        // Returns an object with all Consumer methods adapter to execute a dead letter queue strategy
        return Object.assign(Object.assign({}, innerConsumer), { connect() {
                return innerConsumer.connect().then(() => {
                    dlqInstance.createDLQ();
                });
            }, subscribe(input) {
                return innerConsumer.subscribe(Object.assign(Object.assign({}, input), { topic: dlqInstance.topic, fromBeginning: false }));
            },
            run(input) {
                const { eachMessage } = input;
                return innerConsumer.run(Object.assign(Object.assign({}, input), { eachMessage: ({ topic, partitions, message }) => {
                        try {
                            // If user doesn't pass in callback, DLQ simply listens and returns errors
                            if (dlqInstance.callback) {
                                if (!dlqInstance.callback(message))
                                    throw Error;
                                eachMessage({ topic, partitions, message });
                            }
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
                    } }));
            } });
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
exports.DeadLetterQueue = DeadLetterQueue;
// Ignore
class IgnoreErrorProducer extends Error {
    constructor(e) {
        super(e);
        Error.captureStackTrace(this, this.constructor);
        this.strategy = 'Ignore';
        this.reference = `This error was executed as part of the kafka-penguin Ignore message reprocessing strategy. Your producer attempted to deliver a message ${e.retryCount + 1} times but was unsuccessful.`;
        this.name = `${e.name} (Producer Side)`;
        this.message = e.message;
        this.originalError = e.originalError;
        this.retryCount = e.retryCount;
    }
}
exports.IgnoreErrorProducer = IgnoreErrorProducer;
class IgnoreErrorConsumer extends Error {
    constructor(e) {
        super(e);
        Error.captureStackTrace(this, this.constructor);
        this.strategy = 'Ignore';
        this.reference = `This error was executed as part of the kafka-penguin Ignore message reprocessing strategy. Your consumer attempted to receive a message ${e.retryCount + 1} times but was unsuccessful. As a result, the message was sent to a Dead Letter Queue. Refer to the original error for further information`;
        this.name = `${e.name} (Consumer Side)`;
        this.message = e.message;
        this.originalError = e.originalError;
        this.retryCount = e.retryCount;
    }
}
exports.IgnoreErrorConsumer = IgnoreErrorConsumer;
class Ignore {
    constructor(client, topic, callback) {
        this.topic = topic;
        this.client = client;
        this.callback = callback;
        this.admin = this.client.admin();
        this.innerConsumer = null;
        this.innerProducer = this.client.producer();
    }
    producer() {
        // Reference the Ignore instance for closure in the returned object
        const ignoreInstance = this;
        const { innerProducer } = ignoreInstance;
        // Return an object with all Producer methods adapted to execute Ignore strategy
        console.log('INNER PRODUCER', innerProducer);
        return Object.assign(Object.assign({}, innerProducer), { connect() {
                return innerProducer.connect()
                    .catch((e) => console.log(e));
            },
            send(message) {
                return innerProducer.connect()
                    .then(() => {
                    innerProducer.send(Object.assign(Object.assign({}, message), { topic: message.topic, messages: message.messages }))
                        .catch((e) => {
                        console.log(e);
                        // Print the error to the console
                        const newError = new IgnoreErrorProducer(e);
                        console.log(newError);
                    });
                });
            } });
    }
    consumer(groupId) {
        this.innerConsumer = this.client.consumer(groupId);
        const ignoreInstance = this;
        const { innerConsumer } = ignoreInstance;
        // Returns an object with all Consumer methods adapter to execute ignore strategy
        return Object.assign(Object.assign({}, innerConsumer), { connect() {
                return innerConsumer.connect();
            }, subscribe(input) {
                return innerConsumer.subscribe(Object.assign(Object.assign({}, input), { topic: ignoreInstance.topic, fromBeginning: false }));
            },
            run(input) {
                const { eachMessage } = input;
                return innerConsumer.run(Object.assign(Object.assign({}, input), { eachMessage: ({ topic, partitions, message }) => {
                        try {
                            // If user doesn't pass in callback, DLQ simply listens and returns errors
                            if (ignoreInstance.callback) {
                                if (!ignoreInstance.callback(message))
                                    throw Error;
                                eachMessage({ topic, partitions, message });
                            }
                        }
                        catch (e) {
                            const newError = new IgnoreErrorConsumer(e);
                            console.error(newError);
                        }
                    } }));
            } });
    }
}
exports.default = Ignore;
