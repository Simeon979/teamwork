const authRouter = require('express').Router();

const createUser = require('../controllers/auth/newUser');
const authenticateUser = require('../controllers/auth/signInUser');

authRouter.post('/create-user', createUser);
authRouter.post('/signin', authenticateUser);

module.exports = authRouter;
