const { body, sanitizeBody, validationResult } = require('express-validator');

const { query } = require('../../../db');
const makeErrorResponse = require('../../../domain/makeErrorResponse');

const updateArticle = [
  body('title', 'should not be empty').isLength({ min: 1 }),
  body('article', 'should not be empty').isLength({ min: 1 }),
  sanitizeBody('*').escape(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return makeErrorResponse(res, 400, 'please fill out every field');
    }

    const { employeeid } = req.currentUser;
    const { articleId } = req.params;

    const sql = `
    UPDATE articles
    SET title=$1, article_content=$2
    WHERE article_id=$3 AND poster_id=$4
    RETURNING *
    `;

    try {
      const params = [req.body.title, req.body.article, articleId, employeeid];
      const result = await query(sql, params);
      const [updatedArticle] = result.rows;
      if (!updatedArticle) {
        return makeErrorResponse(res, 404, 'article not found');
      }

      res.unchangedData = {
        createdOn: updatedArticle.created_on,
        articleId: updatedArticle.article_id,
        posterId: updatedArticle.posterId,
      };

      return res.json({
        status: 'success',
        data: {
          message: 'Article successfully updated',
          title: updatedArticle.title,
          article: updatedArticle.article_content,
        },
      });
    } catch (err) {
      return next(err);
    }
  },
];

module.exports = updateArticle;
