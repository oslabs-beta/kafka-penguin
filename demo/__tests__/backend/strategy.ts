import server  from '../../server/app';
import request from 'supertest';

describe("Strategy tests", () => {

  const messageValid = {
    topic: 'kushal',
    message: 'Hello world',
    retries: 4,
    faults: 2,
  };
  const messageInvalid = {
    topic: 'ausar',
    message: 'Hello world',
    retries: 4
  };
  beforeAll(done => {
    done()
  });
  afterAll(done => {
    done()
  });

  describe('Failfast tests', () => {
    it('Expect valid response from valid message', (done: { (): void; ( err: Error, res: request.Response ): void; }) => {
      request(server)     
        .post('/strategy/failfast')
        .send(messageValid)
        .expect('Content-Type', "application/json; charset=utf-8")
        .expect(200)
        .expect(res => {
          expect(res.body.length).toEqual(1);       
          expect(typeof res.body[0] === 'string').toBe(true)
          expect(res.body[0]).toBe('kafka-penguin: Message produced successfully')       
          done()
        })
        .end(done)
    });

    it('Expect error log in response from invalid message', (done: { (): void; ( err: any, res: request.Response ): void; }) => {
      request(server)     
        .post('/strategy/failfast')
        .send(messageInvalid)
        .expect('Content-Type', "application/json; charset=utf-8")
        .expect(200)
        .expect(res => {
          expect(res.body.length).toEqual(messageInvalid.retries + 1)          
          expect(res.body[messageInvalid.retries]).toBe(`kafka-penguin: FailFast stopped producer after ${messageInvalid.retries} times!`)
          res.body.forEach((error: any) => {
            expect(typeof error === 'string').toBe(true)
          })
          done()
        })
        .end(done)
    })
  });

  describe('DLQ tests', () => {

    describe('DLQ Consumer: consuming messages from existent topic', () => {

      it('Expect valid response without interruption of data flow', (done: { (): void; ( err: Error, res: request.Response ): void; }) => {
        request(server)
          .post('/strategy/dlq')
          .send(messageValid)
          .expect(200)
          .expect(res => {
            const messages = res.body.slice(0, res.body.length - 1);
            expect(messages.length).toEqual(messageValid.retries - messageValid.faults);
            messages.forEach((message: any) => {
              expect(message).toEqual('Hello world')
              expect(typeof message).toBe('string')
            });
            expect(res.body[messageValid.retries - messageValid.faults]).toContain('kafka-penguin')
            expect(res.body[messageValid.retries - messageValid.faults]).toContain('2')
            expect(res.body[messageValid.retries - messageValid.faults]).toContain('kushal.deadLetterQueue')
            done()
          })
          .end(done)
      })
    })
  });
  
})