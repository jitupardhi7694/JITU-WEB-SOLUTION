const express = require('express');
const rateLimitter = require('../helpers/authentication/rate-limiter');

const router = express.Router();

router.use(rateLimitter);

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
router.get('/sendActivationLink', function (req, res) {
    res.render('emailVerification');
});

// reset password form and handler
router.get('/forgotPassword/:token');

router.post('/forgotPassword/:token');

//reset password link email form and handler
router.get('/sendResetLink');

router.post('/sendResetLink');

// user activation resend form and handler
router.get('/sendActivationLink');

router.post('/sendActivationLink');

// activate user link handler
router.get('/activate/:token');

// Logout handle
router.get('/logout', (req, res, next) => {});

module.exports = router;
