const jwt = require("jsonwebtoken");

const { JWT_SECRET } = process.env;

const validateToken = (req, res, next) => {
    
    if (!req.headers["authorization"]) {
        return res.status(401).send({error: 'Missing Authorization tokens'});
    } else {
        const authorization = req.headers['authorization'].split(' ');
        if (authorization[0] !== 'Bearer') {
            return res.status(401).send({error: 'Missing Authorization tokens'});
        }
        const token = authorization[1]
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = decoded;
        } catch (err) {
            return res.status(401).send({error: 'Invalid Token'});
        }
        return next();
    }
};

module.exports = validateToken;