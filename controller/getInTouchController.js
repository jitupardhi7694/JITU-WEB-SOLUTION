const { validationResult } = require('express-validator');
const logger = require('../helpers/winston');
const createProfile = require('../models/createProfileModel');
const sendActivationLinkEmail = require('../helpers/profileMailSend');

const profileRegister = async (req, res) => {
    res.render('create_your_profile');
};

// save
const saveProfile = async (req, res, next) => {
    const {
        first_name,
        middle_name,
        last_name,
        dob,
        marital_status,
        gender,
        email,
        mobile_number,
        local_address,
        permanent_address,
        ssc_school,
        ssc_pass_year,
        ssc_grade,
        hsc_school,
        hsc_pass_year,
        hsc_grade,
        graduate_school,
        graduate_pass_year,
        graduate_grade,
        pgraduate_school,
        pgraduate_pass_year,
        pgraduate_grade,
        company_name1,
        position1,
        doj1,
        dol1,
        reason_fjc1,
        company_name2,
        position2,
        doj2,
        dol2,
        reason_fjc2,
        company_name3,
        position3,
        doj3,
        dol3,
        reason_fjc3,
        company_name4,
        position4,
        doj4,
        dol4,
        reason_fjc4,
        company_name5,
        position5,
        doj5,
        dol5,
        reason_fjc5,
        person_name1,
        contact_number1,
        email1,
        remarks1,
        person_name2,
        contact_number2,
        email2,
        remarks2,
    } = req.body;

    const errors = validationResult(req).array(); // Retrieve validation errors

    if (errors.length > 0) {
        return res.render('create_your_profile', {
            errors,
            first_name,
            middle_name,
            last_name,
            dob,
            marital_status,
            gender,
            email,
            mobile_number,
            local_address,
            permanent_address,
            ssc_school,
            ssc_pass_year,
            ssc_grade,
            hsc_school,
            hsc_pass_year,
            hsc_grade,
            graduate_school,
            graduate_pass_year,
            graduate_grade,
            pgraduate_school,
            pgraduate_pass_year,
            pgraduate_grade,
            company_name1,
            position1,
            doj1,
            dol1,
            reason_fjc1,
            company_name2,
            position2,
            doj2,
            dol2,
            reason_fjc2,
            company_name3,
            position3,
            doj3,
            dol3,
            reason_fjc3,
            company_name4,
            position4,
            doj4,
            dol4,
            reason_fjc4,
            company_name5,
            position5,
            doj5,
            dol5,
            reason_fjc5,
            person_name1,
            contact_number1,
            email1,
            remarks1,
            person_name2,
            contact_number2,
            email2,
            remarks2,
        });
    }

    try {
        const newProfile = new createProfile({
            first_name,
            middle_name,
            last_name,
            dob,
            marital_status,
            gender,
            email,
            mobile_number,
            local_address,
            permanent_address,
            ssc_school,
            ssc_pass_year,
            ssc_grade,
            hsc_school,
            hsc_pass_year,
            hsc_grade,
            graduate_school,
            graduate_pass_year,
            graduate_grade,
            pgraduate_school,
            pgraduate_pass_year,
            pgraduate_grade,
            company_name1: company_name1 || null,
            position1: position1 || null,
            doj1: doj1 || null,
            dol1: dol1 || null,

            reason_fjc1: reason_fjc1 || null,
            company_name2,
            position2,
            doj2: doj2 || null,
            dol2: dol2 || null,
            reason_fjc2,
            company_name3,
            position3,
            doj3: doj3 || null,
            dol3: dol3 || null,
            reason_fjc3,
            company_name4,
            position4,
            doj4: doj4 || null,
            dol4: dol4 || null,
            reason_fjc4,
            company_name5,
            position5,
            doj5: doj5 || null,
            dol5: dol5 || null,
            reason_fjc5,
            person_name1,
            contact_number1,
            email1,
            remarks1,
            person_name2,
            contact_number2,
            email2,
            remarks2,
        });
        const savedCareerProfile = await newProfile.save();
        sendActivationLinkEmail(req, res, next, savedCareerProfile.email);

        console.log('successfully submitted your application =>');
        req.flash(
            'success_msg',
            'Successfully submitted your application please check your email .'
        );
        return res.redirect(`/career`);
    } catch (error) {
        logger.error(error);
        return next(error);
    }
};

const jobProfileList = async (req, res) => {
    const row = await createProfile.findAll();
    res.render('masterDashboard/jobProfileTable', {
        row,
    });
};

const deleteJob = async (req, res) => {
    await deleteJobOpening(req, res);
};

// Delete Job Opening from Database
async function deleteJobOpening(req, res) {
    const { id } = req.params;
    try {
        await createProfile.destroy({
            where: {
                id,
            },
        });

        req.flash('success_msg', 'Data deleted successfully.');
        return res.redirect('/career/job-profile-list');
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
                return res.redirect('/career/job-profile-list');
            }
            logger.error("Can't delete User Roles from the database ->", error);
        }
        return null;
    }
}

module.exports = {
    profileRegister,
    saveProfile,
    jobProfileList,
    deleteJob,
};
