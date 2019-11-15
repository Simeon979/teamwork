const feedRouter = require('express').Router();

const getFeed = require('../controllers/feed');

feedRouter.get('/', getFeed);

module.exports = feedRouter;
