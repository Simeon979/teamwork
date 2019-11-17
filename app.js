const express = require('express');

const v1 = require('./routes/v1');
const authorize = require('./services/session');

const app = express();

app.use(express.json());
app.use('/v1/auth', v1.authRouter);
app.use('/v1/gifs', authorize, v1.gifsRouter);
app.use('/v1/articles', authorize, v1.articlesRouter);
app.use('/v1/feed', authorize, v1.feedRouter);

const PORT = process.env.port || 3100;

const server = app.listen(PORT, () => { console.log(`Server running on port ${PORT}`); });

module.exports = {
  app,
  // to clean up after testing
  server,
};
