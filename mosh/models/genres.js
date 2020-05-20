const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  }
});

const Genre = mongoose.model('Genre', genreSchema);

const validateGenre = genre => {
  const schema = {
    name: Joi.string()
      .min(3)
      .required()
  };
  return Joi.validate(genre, schema);
};

exports.Genre = Genre;
exports.genreSchema = genreSchema;
exports.validate = validateGenre;
