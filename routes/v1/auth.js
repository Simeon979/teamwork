const authRouter = require('express').Router();

const createUser = require('../../controllers/auth/v1/newUser');
const authenticateUser = require('../../controllers/auth/v1/signInUser');

authRouter.post('/create-user', createUser);
authRouter.post('/signin', authenticateUser);

module.exports = authRouter;
