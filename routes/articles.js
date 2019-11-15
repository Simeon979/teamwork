const articlesRouter = require('express').Router();

const newArticle = require('../controllers/articles/create');
const updateArticle = require('../controllers/articles/update');

articlesRouter.post('/', newArticle);
articlesRouter.patch('/:articleId', updateArticle);

module.exports = articlesRouter;
