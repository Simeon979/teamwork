const authRouter = require('express').Router();

const createUser = require('../../controllers/auth/v1/newUser');
const authenticateUser = require('../../controllers/auth/v1/signInUser');
const authorize = require('../../services/session');

authRouter.post('/create-user', authorize, createUser);
authRouter.post('/signin', authenticateUser);

module.exports = authRouter;
