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
router.get('/get-in-touch-table', getValidationRules(), async (req, res) => {
    await getInController.getInTouchTable(req, res);
});
router.post(
    '/get-in-touch-table/:id/delete',
    getValidationRules(),
    async (req, res) => {
        await getInController.getInTouchTableDelete(req, res);
    }
);

router.post('/', getValidationRules(), validate, async (req, res) => {
    await getInController.getInTouchRegister(req, res);
});

module.exports = router;
