/* eslint-disable no-redeclare */
/* eslint-disable no-shadow */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable max-classes-per-file */
import { CompressionTypes } from 'kafkajs';

interface messageValue {
  topic: string,
  messages: object[],
}
// Fail Fast Strategy

export class FailFastError extends Error {
  message: any;

  reference: any;

  name: any;

  retryCount: number;

  strategy: string;

  originalError: any;

  constructor(e: any) {
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

export class FailFast {
  retry: number;

  client: any;

  innerProducer: any;

  constructor(num: number, kafkaJSClient: any) {
    this.retry = num;
    this.client = kafkaJSClient;
    this.innerProducer = null;
  }

  producer() {
    const options = {
      retry:
        { retries: this.retry },
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

  send(message: messageValue) {
    return this.innerProducer.send(message)
      .catch((e: any) => {
        this.innerProducer.disconnect();
        const newError = new FailFastError(e);
        // eslint-disable-next-line no-console
        console.log(newError);
      });
  }
}

// Dead Letter Queue

export class DeadLetterQueueErrorConsumer extends Error {
  message: any;

  reference: any;

  name: any;

  retryCount: number;

  strategy: string;

  originalError: any;

  constructor(e: any) {
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

export class DeadLetterQueueErrorProducer extends Error {
  message: any;

  reference: any;

  name: any;

  retryCount: number;

  strategy: string;

  originalError: any;

  constructor(e: any) {
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

interface consumerRunInput {
  eachMessage: ({
    topic,
    partitions,
    message,
  }: {
    topic: string,
    partitions: number,
    message: any
  }) => void,
  eachBatchAutoResolve: boolean,
}

interface consumerSubscribeInput {
  groupId?: String,
  partitionAssigners?: any,
  sessionTimeout?: Number,
  rebalanceTimeout?: Number,
  heartbeatInterval?: Number,
  metadataMaxAge?: Number,
  allowAutoTopicCreation?: Boolean,
  maxBytesPerPartition?: Number,
  minBytes?: Number,
  maxBytes?: Number,
  maxWaitTimeInMs?: Number,
  retry?: Object,
  maxInFlightRequests?: Number,
  rackId?: String
}

interface input {
  eachMessage: ({
    topic,
    partitions,
    message,
  }: {
    topic: string,
    partitions: number,
    message: any
  }) => void
}
export class DeadLetterQueue {
  client: any;

  topic: string;

  callback?: (message: any) => boolean;

  innerConsumer: any;

  admin: any;

  innerProducer: any;

  constructor(client: any, topic: string, callback?: any) {
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
    return {
      ...innerProducer,
      connect() {
        return innerProducer.connect()
          .then(() => {
            dlqInstance.createDLQ();
          })
          .catch((e: Error) => console.log(e));
      },
      send(message: messageValue) {
        return innerProducer.connect()
          .then(() => {
            innerProducer.send({
              ...message,
              topic: message.topic,
              messages: message.messages,
            })
              // Upon error, reroute message to DLQ for the strategy topic
              .catch((e?: any) => {
                innerProducer.send({
                  messages: message.messages,
                  topic: `${dlqInstance.topic}.deadLetterQueue`,
                })
                  .then(innerProducer.disconnect())
                  .catch((e: Error) => console.log(e));
                // Print the error to the console
                const newError = new DeadLetterQueueErrorProducer(e);
                console.log(newError);
              });
          });
      },
    };
  }

  consumer(groupId: { groupId: string }) {
    this.innerConsumer = this.client.consumer(groupId);
    const dlqInstance = this;
    const { innerConsumer, innerProducer } = dlqInstance;
    // Returns an object with all Consumer methods adapter to execute a dead letter queue strategy

    return {
      ...innerConsumer,
      connect() {
        return innerConsumer.connect().then(() => {
          dlqInstance.createDLQ();
        });
      },
      subscribe(input?: consumerSubscribeInput) {
        return innerConsumer.subscribe({
          ...input,
          topic: dlqInstance.topic,
          fromBeginning: false,
        });
      },
      run(input: consumerRunInput) {
        const { eachMessage } = input;
        return innerConsumer.run({
          ...input,
          eachMessage: ({ topic, partitions, message }: {
            topic: string, partitions: number, message: any
          }) => {
            try {
              // If user doesn't pass in callback, DLQ simply listens and returns errors
              if (dlqInstance.callback) {
                if (!dlqInstance.callback(message)) throw Error;
                eachMessage({ topic, partitions, message });
              }
            } catch (e) {
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
                .catch((e: any) => console.log('Error with producing to DLQ: ', e));
            }
          },
        });
      },
    };
  }

  // Creates a new DLQ topic with the original topic name
  async createDLQ() {
    const adminCreateDLQ = await this.admin.connect()
      .then(async () => {
        await this.admin.createTopics({
          topics: [{
            topic: `${this.topic}.deadLetterQueue`,
            numPartitions: 1,
            replicationFactor: 1,
            replicaAssignment: [{ partition: 0, replicas: [0, 1, 2] }],
          }],
        });
      })
      .then(() => this.admin.disconnect())
      .catch((err: any) => console.log('Error from createDLQ', err));
    return adminCreateDLQ;
  }
}

// Ignore

export class IgnoreErrorProducer extends Error {
  message: any;

  reference: any;

  name: any;

  retryCount: number;

  strategy: string;

  originalError: any;

  constructor(e: any) {
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

export class IgnoreErrorConsumer extends Error {
  message: any;

  reference: any;

  name: any;

  retryCount: number;

  strategy: string;

  originalError: any;

  constructor(e: any) {
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

interface messageValue {
  acks?: Number,
  timeout?: Number,
  compression?: CompressionTypes,
  topic: string,
  messages: object[],
}

interface consumerRunInput {
  eachMessage: ({
    topic,
    partitions,
    message,
  }: {
    topic: string,
    partitions: number,
    message: any
  }) => void,
  eachBatchAutoResolve: boolean,
}

interface consumerSubscribeInput {
  groupId?: String,
  partitionAssigners?: any,
  sessionTimeout?: Number,
  rebalanceTimeout?: Number,
  heartbeatInterval?: Number,
  metadataMaxAge?: Number,
  allowAutoTopicCreation?: Boolean,
  maxBytesPerPartition?: Number,
  minBytes?: Number,
  maxBytes?: Number,
  maxWaitTimeInMs?: Number,
  retry?: Object,
  maxInFlightRequests?: Number,
  rackId?: String
}

export class Ignore {
  client: any;

  topic: string;

  callback?: (message: any) => boolean;

  innerConsumer: any;

  admin: any;

  innerProducer: any;

  constructor(client: any, topic: string, callback?: any) {
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
    return {
      ...innerProducer,
      connect() {
        return innerProducer.connect()
          .catch((e: Error) => console.log(e));
      },
      send(message: messageValue) {
        return innerProducer.connect()
          .then(() => {
            innerProducer.send({
              ...message,
              topic: message.topic,
              messages: message.messages,
            })
              .catch((e: Error) => {
                console.log(e);
                // Print the error to the console
                const newError = new IgnoreErrorProducer(e);
                console.log(newError);
              });
          });
      },
    };
  }

  consumer(groupId: { groupId: string }) {
    this.innerConsumer = this.client.consumer(groupId);
    const ignoreInstance = this;
    const { innerConsumer } = ignoreInstance;
    // Returns an object with all Consumer methods adapter to execute ignore strategy
    return {
      ...innerConsumer,
      connect() {
        return innerConsumer.connect();
      },
      subscribe(input?: consumerSubscribeInput) {
        return innerConsumer.subscribe({
          ...input,
          topic: ignoreInstance.topic,
          fromBeginning: false,
        });
      },
      run(input: consumerRunInput) {
        const { eachMessage } = input;
        return innerConsumer.run({
          ...input,
          eachMessage: (
            { topic, partitions, message }: {
              topic: string, partitions: number, message: any
              // eslint-disable-next-line comma-dangle
            }
          ) => {
            try {
              // If user doesn't pass in callback
              if (ignoreInstance.callback) {
                if (!ignoreInstance.callback(message)) throw Error;
                eachMessage({ topic, partitions, message });
              }
            } catch (e) {
              const newError = new IgnoreErrorConsumer(e);
              console.error("kafka Error:", newError);
            }
          },
        })
      },
    };
  }
}
