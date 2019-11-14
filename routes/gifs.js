const gifsRouter = require('express').Router();
const multer = require('multer');

const upload = multer({ dest: 'uploads' });

const createGifs = require('../controllers/gifs/create');

gifsRouter.post('/', upload.single('image'), createGifs);

module.exports = gifsRouter;
