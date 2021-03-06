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
  SELECT created_on, title, article_content, firstname, lastname
  FROM articles
  JOIN employees ON poster_id=employeeid
  WHERE article_id=$1
  `;

  const sql2 = `
  SELECT comment_id, comment, poster_id
  FROM article_comments
  WHERE article_id=$1
  `;

  try {
    const articleIdAsNumber = +articleId;
    const articleResult = await query(sql1, [articleIdAsNumber]);
    if (articleResult.rows.length !== 1) {
      return makeErrorResponse(res, 404, 'article not found');
    }
    const [foundArticle] = articleResult.rows;
    const commentResult = await query(sql2, [articleId]);
    return res.json({
      status: 'success',
      data: {
        id: articleIdAsNumber,
        createdOn: foundArticle.created_on,
        title: foundArticle.title,
        article: foundArticle.article_content,
        authorName: `${foundArticle.firstname} ${foundArticle.lastname}`,
        comments: commentResult.rows.map((comment) => ({
          commentId: comment.comment_id,
          comment: comment.comment,
          authorId: comment.poster_id,
        })),
      },
    });
  } catch (err) {
    console.log(err);
    return next(err);
  }
};

module.exports = getArticle;
