import request from 'supertest';
import dotenv from 'dotenv';
import server from '../../server/app';

dotenv.config();

describe('Static router tests', () => {
  const userDetails = {
    brokers: process.env.KAFKA_BOOTSTRAP_SERVER,
    username: process.env.KAFKA_USERNAME,
    password: process.env.KAFKA_PASSWORD,
  };

  it('Returns array of objects containing topic names and partitions', (done) => {
    request(server)
      .post('/topic/getTopics')
      .send(JSON.stringify(userDetails))
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200)
      .expect((res) => {
        res.body.topics.forEach((topic) => {
          expect(topic.hasOwnProperty('name')).toBe(true);
          expect(topic.hasOwnProperty('partitions')).toBe(true);
          expect(typeof topic.name === 'string').toBe(true);
          expect(Array.isArray(topic.partitions)).toBe(true);
        });
        done();
      })
      .end(done);
  });
});
