const express = require('express');
const rateLimitter = require('../helpers/authentication/rate-limiter');
const getInController = require('../controller/getInTouchController');
const userController = require('../controller/userController');
const router = express.Router();

router.use(rateLimitter);

router.get('/', async (req, res) => {
    await getInController.getInTouch(req, res);
});
router.post('/', async (req, res) => {
    await getInController.getInTouchRegister(req, res);
});
router.get('/login', async (req, res) => {
    res.render('signIn');
});
router.get('/register', async (req, res) => {
    res.render('signUp');
});
router.get('/dashboard', async (req, res) => {
    res.render('dashboard');
});
router.get('/user_roles', async (req, res) => {
    res.render('userRole');
});
router.get('/forget-password', async (req, res) => {
    res.render('forgetPassword');
});
router.get('/sendActivationLink', async (req, res) => {
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
