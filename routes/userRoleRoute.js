const express = require('express');
const router = express.Router();
const UserRoleCotroller = require('../controller/userRolesController');

router.get('/register', async (req, res) => {
    await UserRoleCotroller.getUserRole(req, res);
});
router.get('/view-role', async (req, res) => {
    await UserRoleCotroller.getUserRoleTable(req, res);
});

router.post(
    '/register',

    async (req, res) => {
        await UserRoleCotroller.postUserRole(req, res);
    }
);

router.post('/view-role/:id/delete', async (req, res) => {
    await UserRoleCotroller.deleteUserRole(req, res);
});
module.exports = router;
