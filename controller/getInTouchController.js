const { validationResult } = require('express-validator');
const logger = require('../helpers/authentication/winston');
const getInTouchModel = require('../models/getInTouchModel');
const sendActivationLinkEmail = require('../helpers/authentication/getInTouchMail');

const getInTouch = async (req, res) => {
    await res.render('index');
};

// save
const getInTouchRegister = async (req, res, next) => {
    const { name, email, phone_number, location, message } = req.body;

    const errors = validationResult(req).array(); // Retrieve validation errors

    if (errors.length > 0) {
        return res.render('index', {
            errors,
            name,
            email,
            phone_number,
            location,
            message,
        });
    }

    try {
        const newProfile = new getInTouchModel({
            name,
            email,
            phone_number,
            location,
            message,
        });
        const savedCareerProfile = await newProfile.save();
        sendActivationLinkEmail(
            req,
            res,

            savedCareerProfile.email,
            savedCareerProfile.id
        );

        console.log('successfully submitted your application =>');
        req.flash(
            'success_msg',
            'Successfully submitted your application please check your email .'
        );
        return res.redirect(`/`);
    } catch (error) {
        logger.error(error);
        return error;
    }
};

const getInTouchTable = async (req, res) => {
    const rows = await getInTouchModel.findAll();
    res.render('getInTouchTable', {
        rows,
    });
};

const getInTouchTableDelete = async (req, res) => {
    await deleteTouchTable(req, res);
};

// Delete Job Opening from Database
async function deleteTouchTable(req, res) {
    const { id } = req.params;
    try {
        await getInTouchModel.destroy({
            where: {
                id,
            },
        });
        req.flash('success_msg', 'Data deleted successfully.');
        return res.redirect('/get-in-touch-table');
    } catch (error) {
        logger.error('', error);
        return null;
    }
}

module.exports = {
    getInTouch,
    getInTouchRegister,
    getInTouchTable,
    getInTouchTableDelete,
};
