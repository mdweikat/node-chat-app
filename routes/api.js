var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/users', function(req, res, next) {

  var users = [
    {name:'Murad', age: 24},
    {name:'Saed', age: 26},
    {name:'Fatoom', age: 22}
  ]

  res.json(users);
});

router.get('/users/detail', function(req, res, next) {
  res.send('detail');
});


module.exports = router;
