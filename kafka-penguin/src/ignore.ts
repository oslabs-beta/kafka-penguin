/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import { CompressionTypes } from 'kafkajs';
import IgnoreErrorProducer from './ignoreerrorproducer';
import IgnoreErrorConsumer from './ignoreerrorconsumer';

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

export default class Ignore {
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
    console.log('INNER PRODUCER======', innerProducer);
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
              // If user doesn't pass in callback, DLQ simply listens and returns errors
              if (ignoreInstance.callback) {
                if (!ignoreInstance.callback(message)) throw Error;
                eachMessage({ topic, partitions, message });
              }
            } catch (e) {
              const newError = new IgnoreErrorConsumer(e);
              console.error(newError);
            }
          },
        });
      },
    };
  }
}
