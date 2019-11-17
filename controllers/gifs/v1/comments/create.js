const { body, sanitizeBody, validationResult } = require('express-validator');

const { query } = require('../../../../db');
const makeErrorResponse = require('../../../../domain/makeErrorResponse');

const createComment = [
  body('comment', 'cannot be empty').isLength({ min: 1 }),
  sanitizeBody('*').escape(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return makeErrorResponse(res, 422, 'please fill out every field');
    }

    const { employeeid } = req.currentUser;
    const sql = `
    WITH inserted AS (
      INSERT INTO gif_comments (
        comment,
        gif_id,
        poster_id
      )   VALUES ($1, $2, $3)
      RETURNING *
    )
    SELECT comment, inserted.created_on, title
    FROM inserted JOIN uploaded_gifs ON inserted.gif_id=uploaded_gifs.gif_id
    `;

    try {
      const params = [
        req.body.comment,
        req.params.gifId,
        employeeid,
      ];

      const result = await query(sql, params);

      if (result.rows.length !== 1) {
        return makeErrorResponse(res, 404, 'gif not found');
      }
      const [savedComment] = result.rows;

      return res.json({
        status: 'success',
        data: {
          message: 'comment successfully created',
          createdOn: savedComment.created_on,
          comment: savedComment.comment,
          gifTitle: savedComment.title,
        },
      });
    } catch (err) {
      return next(err);
    }
  },
];

module.exports = createComment;
