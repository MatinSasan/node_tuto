const express = require('express');
const { Genre, validate } = require('../models/genres');
const router = express.Router();

// const genres = [
//   {id: 1, name: 'Action'},
//   {id: 2, name: 'Horror'},
//   {id: 3, name: 'Romance'},
// ]

router.get('/', async (req, res) => {
  const genres = await Genre.find().sort('name');
  res.send(genres);
});

router.post('/', (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { name } = req.body;

  const genre = new Genre({ name });
  genre.save();
  res.send(genre);
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
