const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Joi = require('joi');

const Genre = mongoose.model(
  'Genre',
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50
    }
  })
);

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
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { name } = req.body;

  const genre = new Genre({ name });
  genre.save();
  res.send(genre);
});

router.put('/:id', async (req, res) => {
  const { error } = validateGenre(req.body);
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
  const genre = await Genre.findByIdAndRemove(req.params.id);
  if (!genre)
    return res.status(404).send('The genre with the given ID does not exists');

  res.send(genre);
});

router.get('/:id', async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre)
    return res.status(404).send('The genre with the given ID does not exists');
  res.send(genre);
});

const validateGenre = genre => {
  const schema = {
    name: Joi.string()
      .min(3)
      .required()
  };
  return Joi.validate(genre, schema);
};

module.exports = router;
