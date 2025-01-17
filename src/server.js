
const bodyParser = require("body-parser");
const { authFactory, AuthError } = require("./auth");
const express = require("express");
const app = express();
const swaggerUi = require('swagger-ui-express'), swaggerDocument = require('./swagger.json');

const { JWT_SECRET } = process.env;

if (!JWT_SECRET) {
    throw new Error("Missing JWT_SECRET env var. Set it and restart the server");
}

const auth = authFactory(JWT_SECRET);

app.use(bodyParser.json());

app.post("/auth", (req, res, next) => {
    if (!req.body) {
      return res.status(400).json({ error: "invalid payload" });
    }
  
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({ error: "invalid payload" });
    }
  
    try {
      const token = auth(username, password);
  
      return res.status(200).json({ token });
    } catch (error) {
      if (error instanceof AuthError) {
        return res.status(401).json({ error: error.message });
      }
  
      next(error);
    }
  });

//Routes for /movies micro service
app.use("/movies", require("./movies/moviesRoute"));

//Routes for Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((error, _, res, __) => {
    console.error(
      `Error processing request ${error}. See next message for details`
    );
    console.error(error);
  
    return res.status(500).json({ error: "internal server error" });
  });

module.exports = app;
