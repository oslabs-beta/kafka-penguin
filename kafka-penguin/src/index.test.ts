import { FailFast, DeadLetterQueue, FailFastError } from './index'
import testClient from './clientConfig'
import { callbackify } from 'util';

// Fail Fast Tests
describe("FailFast Tests", () => {
  describe("Constructor", () => {
    const testInstance = new FailFast(3, testClient);
    const mockClient = {
      retry: expect.any(Number),
      innerProducer: null,
      client: expect.any(Object)
    }
   
    describe("Initial State", () => {
      it('Starts off with retries and client supplied', () => {
        expect(testInstance).toBeInstanceOf(FailFast)
        expect(testInstance).toMatchObject(mockClient)
      })
    })

    describe("Client is live & configured", () => {
      it('Client is supplying the class with producers', () => {
        const { client } = testInstance
        const producer = jest.fn(() => client.producer())
        producer();
        expect(producer).toReturnWith(expect.objectContaining({
          send: expect.any(Function),
          connect: expect.any(Function),
          disconnect: expect.any(Function)
        }));
      })
      it('Client is supplying the class with consumers', () => {
        const { client } = testInstance
        const consumer = jest.fn(() => client.consumer({ groupId: 'my-group' }))
        consumer();
        expect(consumer).toReturnWith(expect.objectContaining({
          subscribe: expect.any(Function),
          run: expect.any(Function)
        }));
      })
      it('Client is supplying the class with admins', () => {
        const { client } = testInstance
        const admin = jest.fn(() => client.admin())
        admin();
        expect(admin).toReturnWith(expect.any(Object));
      })
    })
  })

  describe("Methods", () => {
    let testInstance = new FailFast(3, testClient);

    afterEach(() => {
      testInstance = new FailFast(3, testClient)
    });

    describe("Producer", () => {
      const testingProducer = jest.fn(() => testInstance.producer());

      describe("Returns/SideEffects", () => {
        it("returns the FailFast instance", () => {
          testingProducer();
          expect(testInstance.producer()).toBe(testInstance)
        })
        it("Assigns the producer to a instance of client producer", () => {
          testingProducer();
          expect(testInstance.innerProducer).toEqual(expect.objectContaining({
            send: expect.any(Function),
            connect: expect.any(Function),
            disconnect: expect.any(Function)
          }))
        })
      })
    })

    describe("Producer Methods", () => {
      const testingProducer = jest.fn(() => testInstance.producer());
      
      describe("Connect", () => {
        describe("Returns/SideEffects", () => {
          it('returns the client producer connect method', () => {
            testingProducer();
            const { innerProducer } = testInstance
            expect(testingProducer).toReturn()
          })
          it('connect method resolves', () => {
            testingProducer();
            const { innerProducer } = testInstance
            return innerProducer.connect().then((input: any) => expect(input).not.toBeNull())
          })
        })
      })

      describe("Send", () => {
        const message = {
          topic: 'xyz',
          messages: [{
            key: 'xyz',
            value: 'xyz'
          }]
        }
        const send = jest.fn((msg) => { testInstance.send(msg) })

        describe("Inputs", () => {
          it("takes in a message with the message value interface", () => {
            testingProducer();
            send(message);
            expect(send).toHaveBeenCalledWith(expect.objectContaining(message))
          })
          
        })
        describe("Returns/SideEffects", () => {
          
          it("throws a FailFast Error with a bad message", async () => {
            testingProducer();
            const { innerProducer } = testInstance
            
            const sendFunc = await innerProducer.send(message)
              .catch((e: any) => {
                innerProducer.disconnect();
                const newError = new FailFastError(e)
                console.log(newError)
                expect(newError).toBeInstanceOf(FailFastError)
              })
           
          })
          it("disconnects the producer with an bad message", () => {
            testingProducer();
            const { innerProducer } = testInstance
            return innerProducer.send(message).catch((e: any) => {
              expect(e).toBeInstanceOf(Error)
            })
          })
        })
      })

      describe("Disconnect", () => {
        describe("Returns/SideEffects", () => {
          it('returns the client producer disconnect method & disconnects successfully', () => {
            testingProducer();
            const { innerProducer } = testInstance
            expect(innerProducer.disconnect).toEqual(expect.any(Function))
            return innerProducer.disconnect().then((input: any) => expect(input).not.toBeNull())
          })
        })
      })

    })
  })
})


