# Node.js recruitment task
 - Contributors: Deepak Dhamuria

### Routes

 - ```POST /auth``` Accepts a body of ```username``` and ```password``` and returns a token to be used for authorization
 - ```GET /movies``` Takes in a header of ```Authorization``` with value of ```Bearer {token}``` and returns all movies entered by the authorized user
 - ```GET /movies/search``` Search movies based on title. Accepts query parameter of ```title={movie name}``` and responds back with an array of movies
 - ```POST /movies``` Add a movie to the database. Requires a request body of the ```movieID``` fetched from search service

[Visit Swagger docs](http://localhost:3000/api-docs)

### Run locally

 1. Install Docker Desktop
 2. Clone this repository
 3. Change values in ```.env``` file for application running port
 4. run ```docker-compose up -d```
 5. To stop run ```docker-compose down```
 6. Open ```http://localhost:3000/api-docs``` to refer to Swagger docs
