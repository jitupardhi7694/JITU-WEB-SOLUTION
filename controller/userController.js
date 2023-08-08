const { validationResult } = require('express-validator');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const sendActivationLinkEmail = require('../helpers/sendActivationEmail');
const sendResetLinkEmail = require('../helpers/sendResetPasswordEmail');
const logger = require('../helpers/winston');
const UserRoles = require('../models/userRoleModel');

const { JWT_ACTIVE_KEY } = process.env;
const { JWT_RESET_KEY } = process.env;

const getLogin = (req, res) => {
    res.render('userDashboard/userLogin');
};

const postLogin = (req, res, next) => {
    // // Retrieve the saved URL from the session and redirect the user back
    // const returnTo = req.session.returnTo;
    // delete req.session.returnTo;

    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/user/login',
        failureFlash: true,
    })(req, res, next);
};

const getRegister = async (req, res) => {
    const userRoles = await fetchUserRoles();
    res.render('userDashboard/register', {
        userRoles,
        selectedRoleName: null,
        isLogin: true,
    });
};

const postRegister = async (req, res, next) => {
    try {
        const userRoles = await fetchUserRoles(); // Instantiate the UserRoles class
        const { name, email, password, password2, role_id } = req.body;
        const errors = validationResult(req).array(); // Retrieve validation errors

        if (errors.length > 0) {
            // Return to form with errors
            return res.render('userDashboard/register', {
                errors,
                name,
                email,
                password,
                password2,
                selectedRoleName: role_id,
                userRoles,
            });
        }

        const user = await User.findOne({ where: { email } });

        if (user) {
            // User exists, return back to form
            errors.push({ msg: 'Email is already registered.. ' });
            return res.render('userDashboard/register', {
                errors,
                name,
                email,
                password,
                password2,
                userRoles,
                selectedRoleName: role_id,
            });
        }

        // Validations passed, create user and send activation email
        const newUser = new User({ name, email, password, role_id }); // Assign role_id to newUser
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(newUser.password, salt);
        newUser.password = hash;
        const savedUser = await newUser.save();
        sendActivationLinkEmail(req, res, next, savedUser.email);

        console.log('Activation link email saved =>', newUser);
        req.flash(
            'success_msg',
            'Please check your email and activate the account.'
        );
        return res.redirect('/user/login');
    } catch (error) {
        logger.error(error);
        return next(error);
    }
};

const getForgotPassword = async (req, res, next) => {
    try {
        const { token } = req.params;
        const user = await User.findOne({ where: { reset_key: token } });
        if (!user) {
            req.flash('error_msg', 'Invalid token.');
            return res.redirect('/user/sendResetLink');
        }
        return res.render('userDashboard/forgotPassword', { isLogin: true });
    } catch (error) {
        logger.error(error);
        return next(error);
    }
}; // end forgotPassword function

const postForgotPassword = async (req, res, next) => {
    try {
        const { token } = req.params;
        // process further, token issued by us...
        const { password } = req.body;
        const errors = validationResult(req).array();
        if (errors.length > 0) {
            // return to form with errors
            return res.render('userDashboard/forgotPassword', { errors });
        }

        // const secretKey = process.env.JWT_RESET_KEY;
        const decoded = await jwt.verify(token, JWT_RESET_KEY);
        const user = await User.findOne({
            where: { id: decoded.id, email: decoded.email, reset_key: token },
        });

        if (!user) {
            req.flash('error_msg', 'Invalid User or expired link.');
            return res.redirect('/user/sendResetLink');
        }
        // User found with id, email and token
        user.reset_key = ''; // so that same link cannot be used twice...
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        user.password = hash;
        await user.save(); // update user as active and no activation_key
        req.flash(
            'success_msg',
            `Password for <i>${decoded.email}</i> has been updated, you can login now.`
        );
        return res.redirect('/user/login');
    } catch (error) {
        // handle jwt errors

        if (error.name === 'TokenExpiredError') {
            req.flash('error_msg', 'Link is expired, please regenerate...');
            return res.redirect('/user/sendResetLink');
        }

        if (error.name === 'JsonWebTokenError') {
            req.flash('error_msg', 'Link is invalid, please regenerate..');
            return res.redirect('/user/sendResetLink');
        }

        logger.error(error);
        return next(error);
    }
}; // end of postForgotPassword function

const getResetLink = (req, res) =>
    res.render('userDashboard/resetPassword', { isLogin: true }); // end of getResetLink function

const postResetLink = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) {
            req.flash(
                'error_msg',
                `<i>${email}</i> is not registered. Please try again or register first.`
            );
            return res.redirect('/user/sendResetLink');
        }
        // User found with email send activation link email
        sendResetLinkEmail(req, res, next, user.email);
        req.flash(
            'success_msg',
            `An email with link to reset password is sent on <i>${user.email}</i>. Please reset your password.`
        );
        return res.redirect('/user/login');
    } catch (error) {
        logger.error(error);
        return next(error);
    }
}; // end of postResetLink function

const getActivationLink = (req, res) =>
    res.render('userDashboard/resendActivation', { isLogin: true });

const postActivationLink = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) {
            req.flash(
                'error_msg',
                `<i>${email}</i> is not registered. Please try again or register first.`
            );
            return res.redirect('/user/sendActivationLink');
        }
        const result = await sendActivationLinkEmail(
            req,
            res,
            next,
            user.email
        );
        req.flash(
            'success_msg',
            `An email with an activation link has been sent to <i>${user.email}</i>. Please activate your account.`
        );
        return res.redirect('/user/login');
    } catch (error) {
        logger.error(error);
        return next(error);
    }
};

const getActivateLinkHandler = async (req, res, next) => {
    try {
        const { token } = req.params;
        const decoded = await jwt.verify(token, JWT_ACTIVE_KEY);

        const user = await User.findOne({
            where: {
                id: decoded.id,
                email: decoded.email,
                activation_key: token,
            },
        });

        if (!user) {
            req.flash('error_msg', 'Invalid user or link');
            return res.redirect('/user/sendActivationLink');
        }

        user.activation_key = '';
        await user.save();

        req.flash(
            'success_msg',
            `${decoded.email} has been activated. You can now log in.`
        );
        return res.redirect('/user/login');
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            req.flash(
                'error_msg',
                'The activation link has expired. Please regenerate.'
            );
        } else if (error.name === 'JsonWebTokenError') {
            req.flash(
                'error_msg',
                'The activation link is invalid. Please regenerate.'
            );
        } else {
            logger.error(error);
            return next(error);
        }

        return res.redirect('/user/sendActivationLink');
    }
};

const getLogout = (req, res) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash('success_msg', 'You are logged out');
        res.redirect('/user/login');
        return req.session.destroy();
    });
}; // end of getLogout function

async function fetchUserRoles() {
    try {
        const rows = await UserRoles.findAll();
        // console.log(' rows:  =>' + rows);
        return rows;
    } catch (error) {
        if (error) {
            logger.error("Can't fetch user_roles from database", error);
        }
        return null;
    }
}

module.exports = {
    getLogin,
    postLogin,
    getRegister,
    postRegister,
    getForgotPassword,
    postForgotPassword,
    getResetLink,
    postResetLink,
    getActivationLink,
    postActivationLink,
    getActivateLinkHandler,
    getLogout,
};
