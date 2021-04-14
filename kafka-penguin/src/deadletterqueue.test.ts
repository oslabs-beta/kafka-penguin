/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable no-undef */
import DeadLetterQueue from './index';
import DeadLetterQueueErrorProducer from './deadLetterQueueErrorProducer';
import DeadLetterQueueErrorConsumer from './deadLetterQueueErrorConsumer';
import testClient from './clientConfig';

// Dead Letter Queue Tests
describe('Dead Letter Queue Tests', () => {
  // Constructor Tests ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  describe('Constructor', () => {
    const testInstance = new DeadLetterQueue(testClient, 'test1', () => true);
    const mockClient = {
      topic: expect.any(String),
      innerProducer: expect.any(Object),
      callback: expect.any(Function),
      innerConsumer: null,
      admin: expect.any(Object),
      client: expect.any(Object),
    };

    describe('Initial State', () => {
      it('Starts off with callback, topic, and client supplied', () => {
        expect(testInstance).toBeInstanceOf(DeadLetterQueue);
        expect(testInstance).toMatchObject(mockClient);
      });
    });

    describe('Client is live & configured', () => {
      it('Client is supplying the class with producers', () => {
        const { client } = testInstance;
        const producer = jest.fn(() => client.producer());
        producer();
        expect(producer).toReturnWith(expect.objectContaining({
          send: expect.any(Function),
          connect: expect.any(Function),
          disconnect: expect.any(Function),
        }));
      });
      it('Client is supplying the class with consumers', () => {
        const { client } = testInstance;
        const consumer = jest.fn(() => client.consumer({ groupId: 'my-group' }));
        consumer();
        expect(consumer).toReturnWith(expect.objectContaining({
          subscribe: expect.any(Function),
          run: expect.any(Function),
        }));
      });
      it('Client is supplying the class with admins', () => {
        const { client } = testInstance;
        const admin = jest.fn(() => client.admin());
        admin();
        expect(admin).toReturnWith(expect.any(Object));
      });
    });
  });

  describe('Methods', () => {
    let testInstance = new DeadLetterQueue(testClient, 'test1', () => true);

    afterEach(() => {
      testInstance = new DeadLetterQueue(testClient, 'test1', () => true);
    });

    // Producer Initialization ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    describe('Producer', () => {
      const testingProducer = jest.fn(() => testInstance.producer());

      describe('Returns/SideEffects', () => {
        it('returns the DLQ instance', () => {
          testingProducer();
          expect(testInstance.producer()).toMatchObject(expect.objectContaining({
            connect: expect.any(Function),
            disconnect: expect.any(Function),
            send: expect.any(Function),
          }));
        });
        it('Assigns the producer to a instance of client producer', () => {
          testingProducer();
          expect(testInstance.innerProducer).toEqual(expect.objectContaining({
            send: expect.any(Function),
            connect: expect.any(Function),
            disconnect: expect.any(Function),
          }));
        });
      });
    });

    // Consumer Initialization  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    describe('Consumer', () => {
      const id = { groupId: 'Jest Tests' };
      const testingConsumer = jest.fn(() => testInstance.consumer(id));

      describe('Returns/SideEffects', () => {
        it('returns the Dead Letter Queue instance', () => {
          testingConsumer();
          expect(testInstance.consumer(id)).toMatchObject(expect.objectContaining({
            connect: expect.any(Function),
            disconnect: expect.any(Function),
            run: expect.any(Function),
            subscribe: expect.any(Function),
          }));
        });
        it('Assigns the producer to a instance of client producer', () => {
          testingConsumer();
          expect(testInstance.innerConsumer).toEqual(expect.objectContaining({
            connect: expect.any(Function),
            disconnect: expect.any(Function),
            run: expect.any(Function),
            subscribe: expect.any(Function),
          }));
        });
      });
    });

    // Producer Tests ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    describe('Producer Methods', () => {
      const testingProducer = jest.fn(() => testInstance.producer());

      describe('Connect', () => {
        describe('Returns/SideEffects', () => {
          it('returns the client producer connect method', () => {
            testingProducer();
            expect(testingProducer).toReturn();
          });
          it('connect method resolves', () => {
            testingProducer();
            const { innerProducer } = testInstance;
            return innerProducer.connect()
              .then((input: any) => expect(input).not.toBeNull())
              .finally(() => { innerProducer.disconnect(); });
          });
        });
      });

      describe('Send', () => {
        describe('Returns/SideEffects', () => {
          it('throws a DLQ Error with a bad message, then sends it to the DLQ', async () => {
            testingProducer();
            const { innerProducer } = testInstance;
            const message = {
              topic: 'wrong-topic',
              messages: [{
                key: 'value',
                value: 'key',
              }],
            };

            return innerProducer.send(message)
              .catch((e?: any) => {
                innerProducer.send({
                  messages: message.messages,
                  topic: `${testInstance.topic}.deadLetterQueue`,
                })
                  .then(innerProducer.disconnect())
                  .catch((e: Error) => console.log(e));
                // Print the error to the console
                const newError = new DeadLetterQueueErrorProducer(e);
                console.log(newError);
              }).finally(() => { innerProducer.disconnect(); });
          });
          it('disconnects the producer with an bad message', () => {
            testingProducer();
            const { innerProducer } = testInstance;
            const message = {
              topic: 'wrong-topic',
              messages: [{
                key: 'value',
                value: 'key',
              }],
            };
            return innerProducer.send(message).catch((e: any) => {
              expect(e).toBeInstanceOf(Error);
            }).finally(() => { innerProducer.disconnect(); });
          });
        });
      });

      describe('Disconnect', () => {
        describe('Returns/SideEffects', () => {
          it('returns the client producer disconnect method & disconnects successfully', () => {
            testingProducer();
            const { innerProducer } = testInstance;
            expect(innerProducer.disconnect).toEqual(expect.any(Function));
            return innerProducer.disconnect()
              .then((input: any) => expect(input).not.toBeNull())
              .finally(() => { innerProducer.disconnect(); });
          });
        });
      });
    });

    // Consumer Tests ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    describe('Consumer Methods', () => {
      const group = { groupId: 'JestTests' };
      const testingConsumer = jest.fn(() => testInstance.consumer(group));

      describe('Connect', () => {
        describe('Returns/SideEffects', () => {
          it('returns the client consumer connect method', () => {
            testingConsumer();
            expect(testingConsumer).toReturn();
          });
          it('connect method resolves', () => {
            testingConsumer();
            const { innerConsumer } = testInstance;
            return innerConsumer.connect()
              .then((input: any) => expect(input).not.toBeNull())
              .finally(() => { innerConsumer.disconnect(); });
          });
        });
      });

      describe('Send', () => {
        const run = jest.fn(async (input) => {
          await testInstance.innerConsumer.connect()
            .then(() => {
              testInstance.innerConsumer.subscribe({
                topic: testInstance.topic,
                fromBeginning: false,
              });
            })
            .then(() => {
              testInstance.innerConsumer.run(input);
            })
            .catch((e: any) => { expect(e).toBeInstanceOf(Error); })
            .finally(() => testInstance.innerConsumer.disconnect());
        });

        describe('Returns/SideEffects', () => {
          it('throws a DLQ Error with a bad message, then sends it to the DLQ', async () => {
            testingConsumer();
            return run({
              eachMessage: ({ topic, partitions, message }: {
                topic: any, partitions: any, message: any
              }) => false,
            });
          });
        });
      });

      describe('Disconnect', () => {
        describe('Returns/SideEffects', () => {
          it('returns the client producer disconnect method & disconnects successfully', () => {
            testingConsumer();
            const { innerConsumer } = testInstance;
            expect(innerConsumer.disconnect).toEqual(expect.any(Function));
            return innerConsumer.disconnect()
              .then((input: any) => expect(input).not.toBeNull())
              .finally(() => { innerConsumer.disconnect(); });
          });
        });
      });
    });
  });
});
