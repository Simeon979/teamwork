const { body, sanitizeBody, validationResult } = require('express-validator');

const { query } = require('../../../db');
const gifService = require('../../../services/gifUpload');

const makeErrorResponse = require('../../../domain/makeErrorResponse');

const createGif = [
  body('title', 'cannot be empty').isLength({ min: 1 }).trim(),
  sanitizeBody('*').escape(),
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return makeErrorResponse(res, 400, 'there was an error submitting your form');
    }
    const user = req.currentUser;
    const filePath = req.file.path;

    if (!filePath) {
      return makeErrorResponse(res, 400, 'there was an error with the image upload, please retry');
    }

    const sql = `
    INSERT INTO uploaded_gifs (
      gif_id,
      title,
      image_url,
      uploader_id
    ) VALUES ($1, $2, $3, $4)
    RETURNING *
    `;

    try {
      const uploadedFile = await gifService.upload(filePath);
      const fileId = uploadedFile.public_id;
      const fileUrl = uploadedFile.secure_url;
      const { title } = req.body;

      const result = await query(sql, [fileId, title, fileUrl, user.employeeid]);
      const savedGif = result.rows[0];
      return res.json({
        status: 'success',
        data: {
          message: 'GIF image successfully posted',
          gifId: savedGif.gif_id,
          createdOn: savedGif.created_on,
          title: savedGif.title,
          imageUrl: savedGif.image_url,
        },
      });
    } catch (err) {
      return next(err);
    }
  },
];

module.exports = createGif;
