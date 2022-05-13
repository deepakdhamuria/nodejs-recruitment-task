const app = require("../src/server");
const request = require("supertest");
const assert = require("assert");
const moviesModel = require("../src/movies/moviesModel");

var token = "";
let server;

beforeAll(done => {
  request(app)
      .post("/auth")
      .send({
          username: "basic-thomas",
          password: "sR-_pcoow-27-6PAwCD8" 
        })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .then(response => {
        assert(response.body.token);
        token = response.body.token;
        done();
      })
      .catch(err => done(err));
});

afterAll(done => {
  done();
});

beforeEach((done) => {
    server = app.listen(4000, (err) => {
      if (err) return done(err);

       global.agent = request.agent(server);
       done();
    });
});

afterEach((done) => {
  server && server.close(done);
});

describe('Testing /auth endpoint', function() {
  it('responds with 200 HTTP response and a token', (done) => {
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
      }).catch(err => done(err));;
  });
});

describe("Testing /movies/search endpoint", () => {
  it("GET movies/search: Responds with 200 HTTP response and a list of movies", (done) => {
    request(app)
      .get("/movies/search")
      .query({title: "homecoming"})
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .then(response => {
        assert(response.body[0].imdbID, "tt2250912");
        done();
      }).catch(err => done(err));;
  });
});

describe("Testing /movies endpoint", () => {
  it("GET movies: Responds with 401 HTTP response and error for missing token", (done) => {
    request(app)
      .get("/movies")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(401)
      .then(response => {
        assert(response.body.error, "Missing Authorization tokens");
        done();
      }).catch(err => done(err));;
  });

  it("GET movies: Responds with 401 HTTP response and error for invalid token", (done) => {
    request(app)
      .get("/movies")
      .set("Accept", "application/json")
      .set("Authorization", "Bearer somelongtoken")
      .expect("Content-Type", /json/)
      .expect(401)
      .then(response => {
        assert(response.body.error, "Invalid Token");
        done();
      }).catch(err => done(err));;
  });

  it("POST movies: Responds with 401 HTTP response and error for missing token", (done) => {
    request(app)
      .post("/movies")
      .send({
        movieID: "tt2250912"
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(401)
      .then(response => {
        assert(response.body.error, "Missing Authorization tokens");
        done();
      }).catch(err => done(err));;
  });

  it("POST movies: Responds with 401 HTTP response and error for invalid token", (done) => {
    request(app)
      .post("/movies")
      .send({
        movieID: "tt2250912"
      })
      .set("Accept", "application/json")
      .set("Authorization", "Bearer somelongtoken")
      .expect("Content-Type", /json/)
      .expect(401)
      .then(response => {
        assert(response.body.error, "Invalid Token");
        done();
      }).catch(err => done(err));;
  });

  it("POST movies: Responds with 500 HTTP response and an error that quota is over", () => {
    moviesModel.countMoviesOfUser = jest.fn().mockImplementation(() => {
      return [{
        "count(movie_id)": 6
      }]
    });

    request(app)
        .post("/movies")
        .send({
          movieID: "tt2250912"
        })
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .expect("Content-Type", /json/)
        .expect(500)
        .then(response => {
          assert(response.body.error, "You have exceeded this month's quota");
          done();
        }).catch(err => done(err));;
  });

  it("GET movies: Responds with 200 HTTP response and body contains a movie object", () => {
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
    request(app)
        .get("/movies")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .expect("Content-Type", /json/)
        .expect(200)
        .then(response => {
          console.log(response.body);
          assert(response.body.creator_id, 123);
          done();
        }).catch(err => done(err));;
  });

  it("POST movies: Responds with 200 HTTP response and body contains a movie object", () => {
    moviesModel.addMovie = jest.fn().mockImplementation(() => {
      return {
        "status": "success",
        "title": "Spider-Man: Homecoming",
        "release_date": "2017-7-7",
        "director": "Jon Watts",
        "genre": "Action, Adventure, Sci-Fi"
      }
    });

    moviesModel.countMoviesOfUser = jest.fn().mockImplementation(() => {
      return [{
        "count(movie_id)": 1
      }]
    });

    request(app)
        .post("/movies")
        .send({
          movieID: "tt2250912"
        })
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .expect("Content-Type", /json/)
        .expect(200)
        .then(response => {
          assert(response.body.status, "success");
          done();
        }).catch(err => done(err));;
  });
});

