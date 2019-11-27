const { query } = require('../../../db');
const makeErrorResponse = require('../../../domain/makeErrorResponse');

const getGif = async (req, res, next) => {
  const { gifId } = req.params;

  const sql1 = `
  SELECT created_on, title, image_url
  FROM uploaded_gifs
  WHERE gif_id=$1
  `;

  const sql2 = `
  SELECT comment_id, comment, poster_id
  FROM gif_comments
  WHERE gif_id=$1
  `;

  try {
    const gifIdAsNumber = +gifId;
    const gifResult = await query(sql1, [gifIdAsNumber]);
    if (gifResult.rows.length !== 1) {
      return makeErrorResponse(res, 404, 'gif not found');
    }
    const [foundGif] = gifResult.rows;
    const commentResult = await query(sql2, [gifId]);
    return res.json({
      status: 'success',
      data: {
        id: gifIdAsNumber,
        createdOn: foundGif.created_on,
        title: foundGif.title,
        url: foundGif.image_url,
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

module.exports = getGif;
