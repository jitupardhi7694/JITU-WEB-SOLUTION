const express = require('express');
const router = express.Router();
const dashboardController = require('../controller/dashboardController');

router.get('/', async (req, res) => {
    await dashboardController.getDashboard(req, res);
});

module.exports = router;
