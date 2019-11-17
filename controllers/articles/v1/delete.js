const { query } = require('../../../db');
const makeErrorResponse = require('../../../domain/makeErrorResponse');

const deleteArticle = async (req, res, next) => {
  const { employeeid } = req.currentUser;
  const { articleId } = req.params;

  const sql = `
    DELETE FROM articles
    WHERE article_id=$1 AND poster_id=$2
    RETURNING *
    `;

  try {
    const params = [articleId, employeeid];
    const result = await query(sql, params);

    if (result.rows.length !== 1) {
      return makeErrorResponse(res, 404, 'article not found');
    }

    return res.json({
      status: 'success',
      data: {
        message: 'Article successfully deleted',
      },
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = deleteArticle;
