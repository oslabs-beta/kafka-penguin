import server  from '../server/app';
import request from 'supertest';

describe("Strategy tests", () => {

  const messageValid = {
    topic: 'test1',
    message: 'Hello world',
    retries: 2
  };
  const messageInvalid = {
    topic: 'ausar',
    message: 'Hello world',
    retries: 2
  }

  describe('Failfast tests', () => {
    it('Expect valid response from valid message', (done) => {
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

    it('Expect error log in response from invalid message', (done) => {
      request(server)     
        .post('/strategy/failfast')
        .send(messageInvalid)
        .expect('Content-Type', "application/json; charset=utf-8")
        .expect(200)
        .expect(res => {
          expect(res.body.length).toEqual(messageInvalid.retries + 1)          
          expect(res.body[messageInvalid.retries]).toBe(`kafka-penguin: FailFast stopped producer after ${messageInvalid.retries} times!`)
          res.body.forEach(error => {
            expect(typeof error === 'string').toBe(true)
          })
          done()
        })
        .end(done)
    })
  })
})