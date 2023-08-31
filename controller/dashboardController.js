const getInModel = require('../models/getInTouchModel');
const userRoleModel = require('../models/userRoleModel');
const userModel = require('../models/registerModel');

const getDashboard = async (req, res) => {
    const getIn = await getInTouch();
    const user = await userM();
    const userRole = await userRoles();
    res.render('dashboard', {
        getIn,
        user,
        userRole,
    });
};

async function getInTouch() {
    const data = {};
    data.total = await getInModel.count();

    return data.total;
}
async function userM() {
    const data = {};
    data.total = await userModel.count();

    return data.total;
}
async function userRoles() {
    const data = {};
    data.total = await userRoleModel.count();

    return data.total;
}

module.exports = { getDashboard };
