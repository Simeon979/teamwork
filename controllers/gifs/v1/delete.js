const { query } = require('../../../db');
const gifService = require('../../../services/gifUpload');
const makeErrorResponse = require('../../../domain/makeErrorResponse');

const deleteGif = async (req, res, next) => {
  const { employeeid } = req.currentUser;
  const { gifId } = req.params;

  const sql = `
    DELETE FROM uploaded_gifs
    WHERE gif_id=$1 AND uploader_id=$2
    RETURNING *
    `;

  try {
    await gifService.remove(gifId);
    const params = [gifId, employeeid];
    const result = await query(sql, params);

    if (result.rows.length !== 1) {
      return makeErrorResponse(res, 404, 'article not found');
    }

    return res.json({
      status: 'success',
      data: {
        message: 'gif post successfully deleted',
      },
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = deleteGif;
