const { body, sanitizeBody, validationResult } = require('express-validator');

const { query } = require('../../../../db');
const makeErrorResponse = require('../../../../domain/makeErrorResponse');

const createComment = [
  body('comment', 'cannot be empty').isLength({ min: 1 }),
  sanitizeBody('*').escape(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return makeErrorResponse(res, 400, 'please fill out every field');
    }

    const { employeeid } = req.currentUser;
    const sql = `
    WITH inserted AS (
      INSERT INTO article_comments (
        comment,
        article_id,
        poster_id
      )   VALUES ($1, $2, $3)
      RETURNING *
    )
    SELECT comment, inserted.created_on, title, article_content
    FROM inserted JOIN articles ON inserted.article_id=articles.article_id
    `;

    try {
      const params = [
        req.body.comment,
        req.params.articleId,
        employeeid,
      ];

      const result = await query(sql, params);

      if (result.rows.length !== 1) {
        return makeErrorResponse(res, 404, 'article not found');
      }
      const [savedComment] = result.rows;

      return res.json({
        status: 'success',
        data: {
          message: 'Comment successfully created',
          createdOn: savedComment.created_on,
          comment: savedComment.comment,
          articleTitle: savedComment.title,
          article: savedComment.article_content,
        },
      });
    } catch (err) {
      return next(err);
    }
  },
];

module.exports = createComment;
