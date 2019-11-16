const articlesRouter = require('express').Router();

const newArticle = require('../controllers/articles/create');
const updateArticle = require('../controllers/articles/update');
const deleteArticle = require('../controllers/articles/delete');
const createComment = require('../controllers/articles/comments/create');
const getArticle = require('../controllers/articles/read');

articlesRouter.post('/', newArticle);
articlesRouter.patch('/:articleId', updateArticle);
articlesRouter.delete('/:articleId', deleteArticle);
articlesRouter.get('/:articleId', getArticle);

articlesRouter.post('/:articleId/comment', createComment);

module.exports = articlesRouter;
