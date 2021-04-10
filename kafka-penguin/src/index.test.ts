import { FailFast, DeadLetterQueue } from './index'
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
      const { innerProducer } = testInstance
      const testingProducer = jest.fn(() => testInstance.producer());
      
      
      describe("Connect", () => {
        describe("Returns/SideEffects", () => {
          it('returns the client producer connect method', () => {
            testingProducer();
            const { client, innerProducer } = testInstance
            const producer = testInstance.producer();
            expect(producer.connect).not.toBeNull()
          })
          it('connect method resolves', () => {
            testingProducer();
            const { client, innerProducer } = testInstance
            return innerProducer.connect().then((input: any) => expect(input).not.toBeNull())
          })
        })
      })

      xdescribe("Send", () => {
        describe("Inputs", () => {
          it("takes in a message with the message value interface")
          it("throws an error if the message is in the incorrect format")
        })
        describe("Returns/SideEffects", () => {
          it("returns the producer sending")
          it("throws an FailFast Error with a bad message")
          it("disconnects the producer with an bad message")
        })
        describe("Error Handling", () => {
          it("throws an error if the client is empty")
        })
      })

      describe("Disconnect", () => {
        describe("Returns/SideEffects", () => {
          it('returns the client producer disconnect method', () => {
            testingProducer();
            const { client, innerProducer } = testInstance
            expect(innerProducer.disconnect).toEqual(expect.any(Function))
            return innerProducer.disconnect().then((input: any) => expect(input).not.toBeNull())
          })
        })
      })

    })
  })
})


