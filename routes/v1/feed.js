const feedRouter = require('express').Router();

const getFeed = require('../../controllers/feed/v1/feed');

feedRouter.get('/', getFeed);

module.exports = feedRouter;
