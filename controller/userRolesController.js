const userRole = require('../models/userRoleModel');

// Patients Registration Form Page

const getUserRole = async (req, res) => {
    const rows = await userRole.findAll();
    res.render('userDashboard/userRole', {
        rows,
        isLogin: false,
    });
};
// save
const postUserRole = async (req, res) => {
    const user_id = req.id;
    const { id, role_name } = req.body;

    try {
        const rows = await userRole.findAll();
        const createUserRole = await userRole.create({
            rows,
            role_name,
            user_id,
        });
        console.log('createUserRole =>', createUserRole);
        console.log('data successfully save to database');
        req.flash(
            'success_msg',
            `user  ${createUserRole.role_name} is saved. `
        );
        return res.redirect('/user_roles');
    } catch (error) {
        console.log(error);
    }
    return null;
};

module.exports = {
    getUserRole,
    postUserRole,
};
