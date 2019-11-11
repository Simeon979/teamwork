/* eslint-env mocha */

const { server } = require('../app');
const { pool } = require('../db');

// root level hook to cleanup after all tests
after(async () => {
  await pool.end();
  server.close();
});
