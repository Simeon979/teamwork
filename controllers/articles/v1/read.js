const { query } = require('../../../db');
const makeErrorResponse = require('../../../domain/makeErrorResponse');

const getArticle = async (req, res, next) => {
  const { articleId } = req.params;
  /*
  const sql = `
  SELECT article_id, articles.created_on, title, article_content, comment_id, comment, poster_id
  FROM article_comments JOIN articles ON article_comments.article_id=articles.article_id
  WHERE article_id=$1
  `;
*/

  const sql1 = `
  SELECT created_on, title, article_content
  FROM articles
  WHERE article_id=$1
  `;

  const sql2 = `
  SELECT comment_id, comment, poster_id
  FROM article_comments
  WHERE article_id=$1
  `;

  try {
    const articleResult = await query(sql1, [articleId]);
    if (articleResult.rows.length !== 1) {
      return makeErrorResponse(res, 404, 'article not found');
    }
    const [foundArticle] = articleResult.rows;
    const commentResult = await query(sql2, [articleId]);
    return res.json({
      status: 'success',
      data: {
        id: articleId,
        createdOn: foundArticle.created_on,
        title: foundArticle.title,
        article: foundArticle.article_content,
        comments: commentResult.rows.map((comment) => ({
          commentId: comment.comment_id,
          comment: comment.comment,
          authorId: comment.poster_id,
        })),
      },
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = getArticle;
