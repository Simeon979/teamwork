const express = require('express');

const authRouter = require('./routes/auth');
const gifsRouter = require('./routes/gifs');
const articlesRouter = require('./routes/articles');
const feedRouter = require('./routes/feed');
const authorize = require('./services/session');

const app = express();

app.use(express.json());
app.use('/auth', authRouter);
app.use('/gifs', authorize, gifsRouter);
app.use('/articles', authorize, articlesRouter);
app.use('/feed', authorize, feedRouter);

const PORT = 3100;

const server = app.listen(PORT, () => { console.log(`Server running on port ${PORT}`); });

module.exports = {
  app,
  // to clean up after testing
  server,
};
