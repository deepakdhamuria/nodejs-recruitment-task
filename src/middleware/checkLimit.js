var MoviesModel = require('../movies/moviesModel');

const checkLimit = (req, res, next) => {
    const user = req.user;
    var currentDate = new Date();
    var firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    var lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    MoviesModel.countMoviesOfUser(user.userId, firstDay.getTime(), lastDay.getTime(), (err, count) => {
        if (err) {
            return res.status(500).send(err);
        } else {
            if (user.role == "basic" && count[0]["count(movie_id)"] >= 5) {
                return res.status(200).send({error: "You have exceeded this month's quota"});
            } else {
                return next();
            }
        }
    });
};

module.exports = checkLimit;