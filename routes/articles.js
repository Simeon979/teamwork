const articlesRouter = require('express').Router();

const newArticle = require('../controllers/articles/create');
const updateArticle = require('../controllers/articles/update');
const deleteArticle = require('../controllers/articles/delete');

articlesRouter.post('/', newArticle);
articlesRouter.patch('/:articleId', updateArticle);
articlesRouter.delete('/:articleId', deleteArticle);

module.exports = articlesRouter;
