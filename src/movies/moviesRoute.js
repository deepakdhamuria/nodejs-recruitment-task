var express = require('express');
var router = express.Router();
var MoviesModel = require('./moviesModel');
const validateToken = require('../middleware/validateToken');
const checkLimit = require('../middleware/checkLimit');
const axios = require('axios').default;
const { OMBD_API_KEY } = process.env;

//GET method to search movies by title from OMDB
router.get('/search', (req, res) => {
    axios.get(`https://www.omdbapi.com/?s=${req.query.title}&apikey=${OMBD_API_KEY}`)
    .then(function (response) {
        res.status(200).send(response.data["Search"]);
    })
    .catch(function (error) {
        res.status(error.response.status).send(error.response.data);
    });
});

//GET method to fetch movies stored by authenticated user in DB
router.get('/', validateToken, (req, res) => {
    const user = req.user;
    MoviesModel.getMovies(user.userId, (err, rows) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(rows);
        }
    });
});

//POST method to add movies to DB with extra checks on limits
router.post('/', validateToken, checkLimit, (req, res) => {
    const user = req.user;

    //Fetch movie details from OMDB
    axios.get(`https://www.omdbapi.com/?i=${req.body.movieID}&apikey=${OMBD_API_KEY}`)
    .then(function (response) {
        const data = response.data;
        const releasedDateFetched = new Date(data["Released"]);
        
        //Convert date fetched to MySQL date format
        var releasedDate = releasedDateFetched.getFullYear() + "-";
        releasedDate += (releasedDateFetched.getMonth() + 1) + "-";
        releasedDate += releasedDateFetched.getDate();

        const Movie = {
            creator_id: user.userId,
            title: data["Title"],
            release_date: releasedDate,
            genre: data["Genre"],
            director: data["Director"],
            created_date: new Date().getTime()
        };

        //Store data in DB
        MoviesModel.addMovie(Movie, (err, count) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(200).send({
                    status: "success",
                    title: data["Title"],
                    release_date: releasedDate,
                    director: data["Director"],
                    genre: data["Genre"]
                });
            }
        });
    })
    .catch(function (error) {
        res.status(error.response.status).send(error.response.data);
    });
    
});

module.exports = router;