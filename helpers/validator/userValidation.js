const { body, validationResult } = require('express-validator');

const userValidationRules = () => [
    // username must be an email
    body('name').notEmpty().withMessage('Name is required'),
    body('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Not a Valid Email')
        .trim()
        .normalizeEmail(),
    body('password')
        .isLength({ min: 8, max: 25 })
        .withMessage('Password has to be min 8 chars and max 25 char long.'),
    body('confirmPassword')
        .notEmpty()
        .withMessage('Confirm Password cannot be blank.')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                // throw error if passwords do not match
                throw new Error("Passwords don't match");
            } else {
                return value;
            }
        }),
];

const changePasswordRules = () => [
    body('password')
        .isLength({ min: 8, max: 25 })
        .withMessage('Password has to be min 8 chars and max 25 char long.'),
    body('confirmPassword')
        .notEmpty()
        .withMessage('Confirm Password cannot be blank.')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                // throw error if passwords do not match
                throw new Error("Passwords don't match");
            } else {
                return value;
            }
        }),
];

const validate = (req, res, next) => {
    const errors = validationResult(req);
    const extractedErrors = [];
    errors.array().map((error) => extractedErrors.push({ msg: error.msg }));
    req.ValidateErrors = extractedErrors;
    return next();
};

module.exports = {
    userValidationRules,
    changePasswordRules,

    validate,
};
