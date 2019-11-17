const { body, sanitizeBody, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const R = require('ramda');

const { query } = require('../../../db');
const makeErrorResponse = require('../../../domain/makeErrorResponse');

const authenticateUser = [
  body('email', 'cannot be empty').isLength({ min: 1 }).trim(),
  body('email', 'invalid email').isEmail(),
  body('password', 'cannot be empty').isLength({ min: 1 }),
  sanitizeBody('*').escape(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return makeErrorResponse(res, 400, 'there was an error submitting your form');
    }

    try {
      const sql = `
      SELECT employeeid, firstname, dept, passwordHash FROM employees 
        WHERE email=$1
      `;
      const userResult = await query(sql, [req.body.email]);
      if (userResult.rows.length !== 1) {
        return res.status(401).json({ status: 'error', error: 'user not found' });
      }

      const password = R.prop('password', req.body);
      const row = userResult.rows[0];
      const hash = R.prop('passwordhash', row);
      const authResult = await bcrypt.compare(password, hash);
      if (!authResult) {
        return res.status(401).json({
          status: 'error',
          error: 'incorrect email and password combination',
        });
      }

      const payload = R.pick(['employeeid', 'firstname', 'dept'], row);
      const secret = process.env.JWT_KEY;
      const token = await jwt.sign(payload, secret, { expiresIn: '1h' });

      return res.json({
        status: 'success',
        data: {
          userId: +R.prop('employeeid', row),
          token,
        },
      });
    } catch (err) {
      return next(err);
    }
  },
];

module.exports = authenticateUser;
