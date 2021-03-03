const express = require('express')
const router = express.Router()

router.get('/', function (req, res, next) {
  res.render('index')
})

router.get('/description', function (req, res, next) {
  res.render('description')
})

module.exports = router
