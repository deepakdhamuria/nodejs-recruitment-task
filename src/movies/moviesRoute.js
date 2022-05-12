var express = require('express');
var router = express.Router();
var MoviesModel = require('./moviesModel');
const authValidate = require('../middleware/authValidate');
const checkLimit = require('../middleware/checkLimit');
const axios = require('axios').default;
const { OMBD_API_KEY } = process.env;

router.get('/search', (req, res) => {
    axios.get(`https://www.omdbapi.com/?s=${req.query.title}&apikey=${OMBD_API_KEY}`)
    .then(function (response) {
        res.status(200).send(response.data);
    })
    .catch(function (error) {
        res.status(error.response.status).send(error.response.data);
    });
});

router.get('/', authValidate, (req, res) => {
    const user = req.user;
    MoviesModel.getMovies(user.userId, (err, rows) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(rows);
        }
    });
});
router.post('/', authValidate, checkLimit, (req, res) => {
    const user = req.user;
    axios.get(`https://www.omdbapi.com/?i=${req.body.movieID}&apikey=${OMBD_API_KEY}`)
    .then(function (response) {
        const data = response.data;
        const releasedDateFetched = new Date(data["Released"]);
        
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
        MoviesModel.addMovie(Movie, (err, count) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(200).send(count);
            }
        });
    })
    .catch(function (error) {
        res.status(error.response.status).send(error.response.data);
    });
    
});

module.exports = router;