const express = require('express');

const authRouter = require('./routes/auth');

const app = express();

app.use(express.json());
app.use('/auth', authRouter);

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => { console.log(`Server running on port ${PORT}`); });

module.exports = {
  app,
  // to clean up after testing
  server,
};
