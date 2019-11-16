const gifsRouter = require('express').Router();
const multer = require('multer');

const upload = multer({ dest: 'uploads' });

const createGifs = require('../controllers/gifs/create');
const deleteGifs = require('../controllers/gifs/delete');

gifsRouter.post('/', upload.single('image'), createGifs);
gifsRouter.delete('/:gifId', deleteGifs);

module.exports = gifsRouter;
