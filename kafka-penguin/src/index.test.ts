import { FailFast, DeadLetterQueue } from './index'
import testClient from './clientConfig'

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
        xit("Configured producer's retries are equal to the retries set in the instance", () => {
          testingProducer();
          console.log(testInstance.innerProducer.send)
          expect(testInstance.innerProducer.retry.retries).toBe(testInstance.retry)
        })
      })
      xdescribe("Error Handling", () => {
        it('Throws an error if retries is empty')
        it('Throws an error if client is empty')
      })
    })

    xdescribe("Connect", () => {
      describe("Returns/SideEffects", () => {
        it('returns the client producer connect method')
      })
      describe("Error Handling", () => {
        it("returns an error if the client is empty")
      })
    })

    xdescribe("Disconnect", () => {
      describe("Returns/SideEffects", () => {
        it('returns the client producer disconnect method')
      })
      describe("Error Handling", () => {
        it("returns an error if the client is empty")
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

  })


})


