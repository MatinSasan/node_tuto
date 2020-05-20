const express = require('express');
const { Movie, validate } = require('../models/movies');
const { Genre } = require('../models/genres');
const router = express.Router();

// const genres = [
//   {id: 1, name: 'Action'},
//   {id: 2, name: 'Horror'},
//   {id: 3, name: 'Romance'},
// ]

router.get('/', async (req, res) => {
  const movie = await Movie.find().sort('name');
  res.send(movie);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { genreId, title, numberInStock, dailyRentalRate } = req.body;

  const genre = await Genre.findById(genreId);
  if (!genre) return res.status(400).send('Invalid genre');

  let movie = new Movie({
    title,
    genre: { _id: genre._id, name: genre.name },
    numberInStock,
    dailyRentalRate
  });

  movie = await movie.save();
  res.send(movie);
});

router.put('/:id', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { name } = req.body;
  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    { name },
    { new: true }
  );
  if (!genre)
    return res.status(404).send('The genre with the given ID does not exist');

  res.send(genre);
});

router.delete('/:id', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findByIdAndRemove(req.params.id);
  if (!genre)
    return res.status(404).send('The genre with the given ID does not exists');

  res.send(genre);
});

router.get('/:id', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.params.id);
  if (!genre)
    return res.status(404).send('The genre with the given ID does not exists');
  res.send(genre);
});

module.exports = router;
