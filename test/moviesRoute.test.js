const app = require('../src/server');
const jwt = require('jsonwebtoken');
const request = require('supertest');
const assert = require('assert');
const moviesModel = require('../src/movies/moviesModel');

let agent;
let server;

beforeEach(done => {
  server = app.listen(4000, err => {
    if (err) return done(err);

    agent = request(server);
    done();
  });
});

afterEach(done => {
  server && server.close(done);
});

describe('Testing /movies/search endpoint', function() {
  it('GET movies/search: Responds with 200 HTTP response and a list of movies', function(done) {
    request(app)
      .get('/movies/search')
      .query({title: "homecoming"})
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(response => {
        assert(response.body[0].imdbID, 'tt2250912');
        done();
      })
      .catch(err => done(err));
  });
});

describe('Testing /movies endpoint', function() {
  it('GET movies: Responds with 401 HTTP response and error for missing token', function(done) {
    request(app)
      .get('/movies')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(401)
      .then(response => {
        assert(response.body.error, 'Missing Authorization tokens');
        done();
      })
      .catch(err => done(err));
  });
});

describe('Testing /movies endpoint', function() {
  it('GET movies: Responds with 401 HTTP response and error for invalid token', function(done) {
    request(app)
      .get('/movies')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer somelongtoken')
      .expect('Content-Type', /json/)
      .expect(401)
      .then(response => {
        assert(response.body.error, 'Invalid Token');
        done();
      })
      .catch(err => done(err));
  });
});

describe('Testing /movies endpoint', function() {
  it('POST movies: Responds with 401 HTTP response and error for missing token', function(done) {
    request(app)
      .post('/movies')
      .send({
        movieID: "tt2250912"
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(401)
      .then(response => {
        assert(response.body.error, 'Missing Authorization tokens');
        done();
      })
      .catch(err => done(err));
  });
});

describe('Testing /movies endpoint', function() {
  it('POST movies: Responds with 401 HTTP response and error for invalid token', function(done) {
    request(app)
      .post('/movies')
      .send({
        movieID: "tt2250912"
      })
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer somelongtoken')
      .expect('Content-Type', /json/)
      .expect(401)
      .then(response => {
        assert(response.body.error, 'Invalid Token');
        done();
      })
      .catch(err => done(err));
  });
});

describe('Testing /movies endpoint', function() {
  
  it('GET movies: Responds with 200 HTTP response and body contains a movie object', async () => {
    moviesModel.getMovies = jest.fn().mockImplementation(() => {
      return [{
        "movie_id": 1,
        "creator_id": 123,
        "title": "Spider-Man: Homecoming",
        "release_date": "2017-07-07T00:00:00.000Z",
        "genre": "Action, Adventure, Sci-Fi",
        "director": "Jon Watts",
        "created_date": 1652363555482
      }];
    });

    const jwtSpy = jest.spyOn(jwt, 'verify');
    jwtSpy.mockReturnValue({
      "userId": 123,
      "name": "Basic Thomas",
      "role": "basic",
      "iat": 1606221838,
      "exp": 1606223638,
      "iss": "https://www.netguru.com/",
      "sub": "123"
    });

    request(app)
        .get('/movies')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer somelongtoken')
        .expect(200)
        .then(response => {
          assert(response.body.creator_id, 123);
          done();
        })
        .catch(err => done(err));
  });
});

describe('Testing /movies endpoint', function() {
  it('POST movies: Responds with 200 HTTP response and body contains a movie object', async () => {
    moviesModel.addMovie = jest.fn().mockImplementation(() => {
      return {
        "status": "success",
        "title": "Spider-Man: Homecoming",
        "release_date": "2017-7-7",
        "director": "Jon Watts",
        "genre": "Action, Adventure, Sci-Fi"
      }
    });
    const jwtSpy = jest.spyOn(jwt, 'verify');
    jwtSpy.mockReturnValue({
      "userId": 123,
      "name": "Basic Thomas",
      "role": "basic",
      "iat": 1606221838,
      "exp": 1606223638,
      "iss": "https://www.netguru.com/",
      "sub": "123"
    });
  
    request(app)
        .post('/movies')
        .send({
          movieID: "tt2250912"
        })
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer somelongtoken')
        .expect(200)
        .then(response => {
          assert(response.body.status, 'success');
          done();
        })
        .catch(err => done(err));
  });
});

