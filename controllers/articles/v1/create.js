const { body, sanitizeBody, validationResult } = require('express-validator');

const { query } = require('../../../db');
const { makeErrorResponse } = require('../../../domain/makeErrorResponse');

const createArticle = [
  body('title', 'should not be empty').isLength({ min: 1 }),
  body('article', 'should not be empty').isLength({ min: 1 }),
  sanitizeBody('*').escape(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return makeErrorResponse(res, 400, 'please fill out every field');
    }

    const { employeeid } = req.currentUser;

    const sql = `
    INSERT INTO articles (
      title,
      article_content,
      poster_id
    ) VALUES ($1, $2, $3)
    RETURNING *
    `;

    try {
      const params = [req.body.title, req.body.article, employeeid];
      const result = await query(sql, params);
      const savedArticle = result.rows[0];

      return res.json({
        status: 'success',
        data: {
          message: 'Article successfully posted',
          articleId: savedArticle.article_id,
          createdOn: savedArticle.created_on,
          title: savedArticle.title,
        },
      });
    } catch (err) {
      return next(err);
    }
  },
];

module.exports = createArticle;
