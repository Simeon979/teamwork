const articlesRouter = require('express').Router();

const newArticle = require('../controllers/articles/create');

articlesRouter.post('/', newArticle);

module.exports = articlesRouter;
