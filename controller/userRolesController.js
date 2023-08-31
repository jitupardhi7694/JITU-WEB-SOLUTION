const userRole = require('../models/userRoleModel');

// Patients Registration Form Page

const getUserRole = async (req, res) => {
    const rows = await userRole.findAll();
    res.render('userRole', { rows });
};
const getUserRoleTable = async (req, res) => {
    const rows = await userRole.findAll();
    res.render('userRoleTable', { rows });
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
        return res.redirect('/user_roles/register');
    } catch (error) {
        console.log(error);
    }
    return null;
};

const deleteUserRole = async (req, res) => {
    await userRoleDelete(req, res);
};

// Delete Job Opening from Database
async function userRoleDelete(req, res) {
    const { id } = req.params;
    try {
        await userRole.destroy({
            where: {
                id,
            },
        });

        req.flash('success_msg', 'Data deleted successfully.');
        return res.redirect('/user_roles/view-role');
    } catch (error) {
        if (error) {
            if (
                error.message.includes(
                    'Cannot delete or update a parent row: a foreign key constraint fails'
                )
            ) {
                req.flash(
                    'error_msg',
                    'Cannot delete this record as it is already in use.'
                );
                return res.redirect('/user_roles/view-role');
            }
            logger.error("Can't delete User Roles from the database ->", error);
        }
        return null;
    }
}

module.exports = {
    getUserRole,
    postUserRole,
    deleteUserRole,
    getUserRoleTable,
};
