const express = require('express');
const router = express.Router();

let courses = [
  { id: 1, name: 'course1' },
  { id: 2, name: 'course2' },
  { id: 3, name: 'course3' }
];

router.get('/:year/:month', (req, res) => {
  res.send([req.params, req.query]);
});

router.get('/:id', (req, res) => {
  const course = courses.find(c => c.id === +req.params.id);
  if (!course) return res.status(404).send('Not Found');
  res.send(course);
});

router.get('/', (req, res) => {
  res.send(courses);
});

router.post('/', (req, res) => {
  const { error } = validateCourse(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const course = {
    id: courses.length + 1,
    name: req.body.name
  };
  courses.push(course);
  res.send(course);
});

router.put('/:id', (req, res) => {
  const course = courses.find(c => c.id === +req.params.id);
  if (!course) return res.status(404).send('invalid');

  const { error } = validateCourse(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  course.name = req.body.name;
  res.send(course);
});

function validateCourse(course) {
  const schema = {
    name: Joi.string()
      .min(3)
      .required()
  };

  return Joi.validate(course, schema);
}

router.delete('/:id', (req, res) => {
  const course = courses.find(c => c.id === +req.params.id);
  if (!course) return res.status(404).send('invalid');

  courses = courses.filter(c => c.id !== +req.params.id);

  res.send([course, courses]);
});

module.exports = router;
