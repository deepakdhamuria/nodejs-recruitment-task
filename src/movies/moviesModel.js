var db = require('../common/dbConnection');

var MoviesModel = {

    getMovies: (creatorID, callback) => {

        return db.query("Select * from movie WHERE creator_id=" + creatorID, callback);
    },
    addMovie: (Movie, callback) => {
        return db.query("Insert into movie ( creator_id, title, release_date, genre, director, created_date)"
        + " values (?,?,?,?,?,?)", 
        [Movie.creator_id, Movie.title, Movie.release_date, Movie.genre, Movie.director, Movie.created_date]
        , callback);
    },
    countMoviesOfUser: (creatorID, startTime, endTime, callback) => {
        return db.query(`Select count(movie_id) from movie 
            WHERE creator_id=${creatorID} 
            AND created_date BETWEEN ${startTime} AND ${endTime}`, callback);
    }

};

module.exports = MoviesModel;