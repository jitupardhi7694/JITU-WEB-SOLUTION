const express = require('express');

const router = express.Router();

router.get('/', function (req, res) {
    res.render('index');
});
router.get('/login', function (req, res) {
    res.render('signIn');
});
router.get('/register', function (req, res) {
    res.render('signUp');
});
router.get('/forget-password', function (req, res) {
    res.render('forgetPassword');
});

module.exports = router;
