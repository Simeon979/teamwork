const { Pool } = require('pg');

const nodeEnv = process.env.NODE_ENV;

const connectionString = nodeEnv === 'test'
  ? process.env.TEST_DATABASE_STRING
  : process.env.DATABASE_STRING;

const pool = new Pool({
  connectionString,
});

pool.on('connect', () => {
  console.log(`successfully connected to ${nodeEnv === 'test' ? 'test' : 'production'} database`);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
