const authRouter = require('express').Router();

const createUser = require('../controllers/auth/newUser');

authRouter.post('/create-user', createUser);

module.exports = authRouter;
