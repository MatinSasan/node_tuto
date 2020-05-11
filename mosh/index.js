const express = require('express');
const Joi = require('joi');
const config = require('config');
const courses = require('./routes/courses');
const home = require('./routes/home');
const helmet = require('helmet');
const morgan = require('morgan');

const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());

app.use('/api/courses', courses);
app.use('/', home);

app.set('view engine', 'pug');
app.set('views', './views'); //default

console.log(`Application Name: ${config.get('name')}`);

// console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`app: ${app.get('env')}`);
console.log(`DEBUG: ${process.env.DEBUG}`);

if (app.get('env') === 'development') {
  app.use(morgan('dev'));
  // console.log('Morgan enabled...');
  startupDebugger('Morgan enabled...');
}

dbDebugger('Connected to database...');

app.use((req, res, next) => {
  console.log('Logging...');
  next();
});

app.listen(3000, () => console.log(`listening on port 3000...`));
