const jwt = require('jsonwebtoken');
const { query } = require('../db');

const makeErrorResponse = require('../domain/makeErrorResponse');

const secret = process.env.JWT_KEY;

const verify = async (req, res, next) => {
  const { token } = req.headers;
  try {
    const decoded = jwt.verify(token, secret);
    const sql = 'SELECT  * FROM employees WHERE employeeid=$1';

    const user = await query(sql, [decoded.employeeid]);
    if (user.rows.length !== 1) {
      return makeErrorResponse(res, 401, 'user not found');
    }

    [req.currentUser] = user.rows;
    return next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return makeErrorResponse(res, 401, 'session expired, please log in again');
    }

    if (err.name === 'JsonWebTokenError') {
      return makeErrorResponse(res, 401, 'invalid token');
    }

    return next(err);
  }
};

module.exports = verify;
