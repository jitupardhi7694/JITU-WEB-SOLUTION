const { validationResult } = require('express-validator');
const logger = require('../helpers/authentication/winston');
const getInTouchModel = require('../models/getInTouchModel');
const sendActivationLinkEmail = require('../helpers/authentication/getInTouchMail');

const getInTouch = async (req, res) => {
    res.render('index');
};

// save
const getInTouchRegister = async (req, res, next) => {
    const { name, email, number, location, message } = req.body;

    const errors = validationResult(req).array(); // Retrieve validation errors

    if (errors.length > 0) {
        return res.render('index', {
            errors,
            name,
            email,
            number,
            location,
            message,
        });
    }

    try {
        const newProfile = new getInTouchModel({
            name,
            email,
            number,
            location,
            message,
        });
        const savedCareerProfile = await newProfile.save();
        sendActivationLinkEmail(
            req,
            res,
            next,
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

const getTable = async (req, res) => {
    const row = await getInTouchModel.findAll();
    res.render('getInTouchTable', {
        row,
    });
};

const deleteTable = async (req, res) => {
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
        return res.redirect('/');
    } catch (error) {
        logger.error('', error);
        return null;
    }
}

module.exports = {
    getInTouch,
    getInTouchRegister,
    getTable,
    deleteTable,
    deleteTouchTable,
};
