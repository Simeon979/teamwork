const express = require('express');

const authRouter = require('./routes/auth');
const gifsRouter = require('./routes/gifs');
const authorize = require('./services/session');

const app = express();

app.use(express.json());
app.use('/auth', authRouter);
app.use('/gifs', authorize, gifsRouter);

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => { console.log(`Server running on port ${PORT}`); });

module.exports = {
  app,
  // to clean up after testing
  server,
};
