const { query } = require('../../../db');

const getFeed = async (req, res, next) => {

  const sql = `
    SELECT
      article_id AS id,
      created_on,
      title,
      article_content AS content,
      poster_id AS author_id,
      'article' AS type
    FROM articles
    UNION
    SELECT
      gif_id AS id,
      created_on,
      title,
      image_url AS content,
      uploader_id AS author_id,
      'gif' AS type
    FROM uploaded_gifs
    ORDER BY created_on ASC;
  `;
  try {
    const result = await query(sql);
    const data = result.rows.map((row) => ({
      id: row.id,
      createdOn: row.created_on,
      title: row.title,
      [`${row.type === 'article' ? 'article' : 'url'}`]: row.content,
      authorId: row.author_id,
    }));
    return res.json({
      status: 'success',
      data,
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = getFeed;