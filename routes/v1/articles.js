const articlesRouter = require('express').Router();

const newArticle = require('../../controllers/articles/v1/create');
const updateArticle = require('../../controllers/articles/v1/update');
const deleteArticle = require('../../controllers/articles/v1/delete');
const createComment = require('../../controllers/articles/v1/comments/create');
const getArticle = require('../../controllers/articles/v1/read');

articlesRouter.post('/', newArticle);
articlesRouter.patch('/:articleId', updateArticle);
articlesRouter.delete('/:articleId', deleteArticle);
articlesRouter.get('/:articleId', getArticle);

articlesRouter.post('/:articleId/comment', createComment);

module.exports = articlesRouter;
