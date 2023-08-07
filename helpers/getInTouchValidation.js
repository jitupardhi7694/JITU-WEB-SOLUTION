const { body, validationResult } = require('express-validator');

var getInValidation = () => [
    body('name')
        .withMessage('Please enter your name')
        .isLength({ min: 2, max: 45 })
        .withMessage('Please enter minimum 2 character and maximum 45'),
    body('email').isEmail().withMessage('Email is required'),
    body('number').withMessage('Please enter Phonen number'),
    body('message')
        .isEmail()
        .withMessage('message is required')
        .isLength({ min: 10, max: 200 })
        .withMessage('Please enter minimum 10 character and maximum 200'),
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

module.exports = { getInValidation, validate };
