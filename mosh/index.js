const express = require('express');
const Joi = require('joi');
const helmet = require('helmet');
const morgan = require('morgan');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());

console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`app: ${app.get('env')}`);

if (app.get('env') === 'development') {
  app.use(morgan('dev'));
  console.log('Morgan enabled...');
}

app.use((req, res, next) => {
  console.log('Logging...');
  next();
});

let courses = [
  { id: 1, name: 'course1' },
  { id: 2, name: 'course2' },
  { id: 3, name: 'course3' }
];

app.get('/', (req, res) => {
  res.send('Hello :D');
});

app.get('/api/courses/:year/:month', (req, res) => {
  res.send([req.params, req.query]);
});

app.get('/api/courses', (req, res) => {
  res.send(courses);
});

app.get('/api/courses/:id', (req, res) => {
  const course = courses.find(c => c.id === +req.params.id);
  if (!course) return res.status(404).send('Not Found');
  res.send(course);
});

app.post('/api/courses', (req, res) => {
  const { error } = validateCourse(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const course = {
    id: courses.length + 1,
    name: req.body.name
  };
  courses.push(course);
  res.send(course);
});

app.put('/api/courses/:id', (req, res) => {
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

app.delete('/api/courses/:id', (req, res) => {
  const course = courses.find(c => c.id === +req.params.id);
  if (!course) return res.status(404).send('invalid');

  courses = courses.filter(c => c.id !== +req.params.id);

  res.send([course, courses]);
});

app.listen(3000, () => console.log(`listening on port 3000...`));
