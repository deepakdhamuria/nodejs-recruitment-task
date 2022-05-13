
const PORT = process.env.APP_PORT;

const app = require('./server.js');

app.listen(PORT, () => {
  console.log(`auth svc running at port ${PORT}`);
});