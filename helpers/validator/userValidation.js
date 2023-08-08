const { body, validationResult } = require('express-validator');

var loginValidation = () => [
    body('email').isEmail().withMessage('Please enter your email'),
    body('password').isPassword().withMessage('Please enter your password'),
];
var registerValidation = () => [
    body('name')
        .withMessage('Please enter your name')
        .isLength({ min: 2, max: 45 })
        .withMessage('Please enter minimum 2 character and maximum 45'),
    body('email').isEmail().withMessage('Please enter your email'),
    body('password')
        .isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
        })
        .withMessage(
            'Password must be greater than 8 and contain at least one uppercase letter, one lowercase letter, and one number'
        ),
    body('confirmPassword')
        .isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
        })
        .withMessage(
            'Password must be greater than 8 and contain at least one uppercase letter, one lowercase letter, and one number'
        ),
];
var forgetPassValidation = () => [
    body('password')
        .isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
        })
        .withMessage(
            'Password must be greater than 8 and contain at least one uppercase letter, one lowercase letter, and one number'
        ),
    body('confirmPassword')
        .isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
        })
        .withMessage(
            'Password must be greater than 8 and contain at least one uppercase letter, one lowercase letter, and one number'
        ),
];

const validate = (validations) => {
    return async (req, res, next) => {
        await Promise.all(validations.map((validation) => validation.run(req)));

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        res.status(400).json({
            errors: errors.array(),
        });
    };
};

module.exports = {
    loginValidation,
    registerValidation,
    forgetPassValidation,
    validate,
};
