const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  // connected to pug
  res.render('index', {
    title: 'Welcome ^_^',
    message: 'Hello there :D'
  });
});

module.exports = router;
