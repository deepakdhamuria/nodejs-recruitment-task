const request = require('supertest');
const assert = require('assert');
const app = require('../src/server');

describe('Testing /auth endpoint', function() {
  it('responds with 200 HTTP response and a token', function(done) {
    request(app)
      .post('/auth')
      .send({
          username: "basic-thomas",
          password: "sR-_pcoow-27-6PAwCD8" 
        })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(response => {
        assert(response.body.token);
        done();
      })
      .catch(err => done(err));
  });
});

