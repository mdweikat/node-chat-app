var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Cool, huh!', condition: false });
});

router.get('/chat', function(req, res, next) {
  res.render('chat', { title: 'Chat Box!', condition: false });
});

router.get('/chat2', function(req, res, next) {
  res.render('chat2', { title: 'Chat Box!', condition: false });
});

/* GET users listing. */
router.get('/users', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/users/detail', function(req, res, next) {
  res.send('detail');
});


module.exports = router;
