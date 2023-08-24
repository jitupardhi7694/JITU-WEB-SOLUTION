const express = require('express');
const rateLimitter = require('../helpers/authentication/rate-limiter');
const getInController = require('../controller/getInTouchController');
const {
    getValidationRules,
    validate,
} = require('../helpers/validator/getInTouchValidation');

const router = express.Router();

router.use(rateLimitter);

router.get('/', getValidationRules(), async (req, res) => {
    await getInController.getInTouch(req, res);
});

router.post('/', getValidationRules(), validate, async (req, res) => {
    await getInController.getInTouchRegister(req, res);
});

module.exports = router;
