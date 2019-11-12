const { body, sanitizeBody, validationResult } = require('express-validator');
const R = require('ramda');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { query } = require('../../db');

const reqInfo = [
  'firstName',
  'lastName',
  'email',
  'password',
  'gender',
  'jobRole',
  'department',
  'address',
];

const createUser = [
  body('firstName', 'cannot be empty').isLength({ min: 1 }).trim(),
  body('lastName', 'cannot be empty').isLength({ min: 1 }).trim(),
  body('email', 'cannot be empty').isLength({ min: 1 }).trim(),
  body('password', 'cannot be empty').isLength({ min: 1 }).trim(),
  body('gender', 'cannot be empty').isLength({ min: 1 }).trim(),
  body('jobRole', 'cannot be empty').isLength({ min: 1 }).trim(),
  body('department', 'cannot be empty').isLength({ min: 1 }).trim(),
  body('address', 'cannot be empty').isLength({ min: 1 }).trim(),
  body('email', 'invalid email').isEmail(),
  sanitizeBody('*').escape(),
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({
        status: 'error',
        error: errors.array(),
      });
    }

    const sql = `
    INSERT INTO employees(
      firstname,
      lastname,
      email,
      passwordhash,
      gender,
      jobrole,
      dept,
      employeeaddress
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
    `;
    try {
      const userInfo = R.pick(reqInfo, req.body);

      const password = R.prop('password', userInfo);
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);


      const userInfoWithHash = R.assoc('password', hashedPassword, userInfo);
      const userInfoWithHashValues = R.values(userInfoWithHash);

      const result = await query(sql, userInfoWithHashValues);
      const savedValues = result.rows[0];

      const payload = R.pick(['employeeid', 'firstname', 'dept'], savedValues);
      const secret = process.env.JWT_KEY;
      const token = await jwt.sign(payload, secret, { expiresIn: '1h' });

      return res.json({
        status: 'success',
        data: {
          message: 'User account successfully created',
          userId: +R.prop('employeeid', savedValues),
          token,
        },
      });
    } catch (err) {
      return next(err);
    }
  },
];

module.exports = createUser;
