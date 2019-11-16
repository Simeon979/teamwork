const cloudinary = require('cloudinary').v2;

module.exports = {
  upload: cloudinary.uploader.upload,
  remove: cloudinary.uploader.destroy,
};
