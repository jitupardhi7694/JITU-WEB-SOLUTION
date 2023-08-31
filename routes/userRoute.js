const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const {
    userValidationRules,
    changePasswordRules,

    validate,
} = require('../helpers/validator/userValidation');
const {
    ensureAuthenticated,
    ensureNotAuthenticated,
} = require('../helpers/authentication/auth-helper');
const rateLimiter = require('../helpers/authentication/rate-limiter');
router.use(rateLimiter);

// Login Page
router.get('/login', ensureNotAuthenticated, (req, res, next) => {
    // Save the calling URL in the session
    req.session.returnTo = req.headers.referer || req.originalUrl || req.url;
    userController.getLogin(req, res, next);
});

// Login handle
router.post('/login', ensureNotAuthenticated, (req, res, next) => {
    userController.postLogin(req, res, next);
});

// Register Page
router.get('/register', ensureNotAuthenticated, (req, res, next) => {
    userController.getRegister(req, res, next);
});
router.get('/registerTable', (req, res, next) => {
    userController.getRegisterTable(req, res, next);
});
router.post('/registerTable/:id/delete', (req, res, next) => {
    userController.deleteUser(req, res, next);
});

// Register handle, uses validate middleware
router.post(
    '/register',
    ensureNotAuthenticated,
    userValidationRules(),
    async (req, res, next) => {
        userController.postRegister(req, res, next);
    }
);

// reset password form and handler
router.get(
    '/forgotPassword/:token',
    ensureNotAuthenticated,
    async (req, res, next) => {
        console.log('GET:', req.params.token);
        userController.getForgotPassword(req, res, next);
    }
);

router.post(
    '/forgotPassword/:token',
    changePasswordRules(),
    ensureNotAuthenticated,
    async (req, res, next) => {
        console.log('POST:', req.params.token);
        userController.postForgotPassword(req, res, next);
    }
);

// reset password link email form and handler
router.get('/sendResetLink', ensureNotAuthenticated, (req, res, next) => {
    userController.getResetLink(req, res, next);
});

router.post(
    '/sendResetLink',
    ensureNotAuthenticated,
    async (req, res, next) => {
        userController.postResetLink(req, res, next);
    }
);

// user activation resend form and handler
router.get('/sendActivationLink', ensureNotAuthenticated, (req, res, next) => {
    userController.getActivationLink(req, res, next);
});

router.post(
    '/sendActivationLink',
    ensureNotAuthenticated,
    async (req, res, next) => {
        userController.postActivationLink(req, res, next);
    }
);

// activate user link handler
router.get(
    '/activate/:token',
    ensureNotAuthenticated,
    async (req, res, next) => {
        userController.getActivateLinkHandler(req, res, next);
    }
);

// Logout handle
router.get('/logout', ensureAuthenticated, (req, res, next) => {
    userController.getLogout(req, res, next);
});

module.exports = router;
