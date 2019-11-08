/* eslint-env jasmine */
const db = require('../db');

describe('Database', () => {
  it('Connect successfully to database', async () => {
    const result = await db.query('SELECT 1 AS val');
    expect(result.rows[0].val).toBe(1);
  });
});
