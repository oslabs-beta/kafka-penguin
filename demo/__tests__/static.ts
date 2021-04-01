import server  from '../server/app';
import request from 'supertest';

describe("Static tests", () => {
  //check topic router to topics/getTopics/ end point
  it("Serves html file to '/' endpoint", (done) => {
    request(server)     
        .get('/')
        .expect('Content-Type', /html/)
        .expect(200)
        .end(done)
  });

  it("Serves files from assets directory", (done) => {
    request(server)     
        .get('/assets/penguin.svg')
        .expect('Content-Type', 'image/svg+xml')
        .expect(200)
        .end(done)
  });
})
